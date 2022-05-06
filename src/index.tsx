import { ActionPanel, Detail, List, Action, Form, useNavigation } from "@raycast/api";
import { Toast, showToast } from "@raycast/api";
import { useEffect, useState } from "react";
import Ping from "ping";

export default function Command() {
  const [items, setItems] = useState<string[]>(["baidu.com", "qq.com"]);

  useEffect(() => {
    console.log("show ping");
  }, []);

  const createNewPing = async (address: string) => {
    setItems([address, ...items]);
  };

  return (
    <List>
      {items.map((e) => (
        <PingCell key={e} address={e} />
      ))}
      <List.Item
        title="Ping New"
        actions={
          <ActionPanel title="Ping">
            <Action.Push title="Create New Ping" target={NewPing(createNewPing)} />
          </ActionPanel>
        }
      />
      <List.Item
        title="Ping All"
        actions={
          <ActionPanel title="Ping">
            <Action title="Ping All"></Action>
          </ActionPanel>
        }
      />
    </List>
  );
}

const PingCell = (props) => {
  const { address } = props;
  const [status, setStatus] = useState<string>("");
  useEffect(() => {
    console.log("ping " + address);
    ping();
  }, []);

  const ping = async () => {
    setStatus("pinging...");
    Ping.promise.probe(address).then(async (res) => {
      console.log(res);
      const { alive, avg } = res;
      if (alive) {
        setStatus(avg.split(".")[0] + " ms");
      } else {
        const toast = await showToast({
          title: "No response " + address,
          style: Toast.Style.Failure,
        });
        setStatus("fail");
      }
    });
  };

  return (
    <List.Item
      key={address}
      title={address}
      subtitle={status}
      actions={
        <ActionPanel title="Ping">
          <Action title="Ping" onAction={ping} />
        </ActionPanel>
      }
    />
  );
};

const NewPing = (createNewPing: (address: string) => void) => {
  const { pop } = useNavigation();
  return (
    <Form
      actions={
        <ActionPanel>
          <Action.SubmitForm
            title="Start Ping"
            onSubmit={(values) => {
              const { address } = values;
              createNewPing(address);
              pop();
            }}
          />
        </ActionPanel>
      }
    >
      <Form.TextField title="Address" id="address" defaultValue="www.baidu.com" />
    </Form>
  );
};
