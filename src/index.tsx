import { ActionPanel, Detail, List, Action, Form, useNavigation } from "@raycast/api";
import { useEffect, useState } from "react";
import ping, { PingConfig } from "ping";

export default function Command() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [newAddress, setNewAddress] = useState<string>("");

  useEffect(() => {
    console.log("show ping");
  }, []);

  return (
    <List isLoading={isLoading}>
      <List.Item
        title="Ping New"
        subtitle={newAddress}
        actions={
          <ActionPanel title="Ping">
            <Action.Push title="Create New Ping" target={NewPing(setNewAddress)} />
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

const NewPing = (createNewPing: (address: string) => void) => {
  const { pop } = useNavigation();
  return (
    <Form
      actions={
        <ActionPanel>
          <Action.SubmitForm
            title="Start Ping"
            onSubmit={(values) => {
              const { address, port } = values;
              const config = {
                host: address + ":" + port,
              } as PingConfig;
              ping.promise.probe(address + ":" + port, config).then((res) => {
                const isAlive = res.alive;
                console.log(res);
                createNewPing(isAlive ? "success" : "fail");
              });
              pop();
            }}
          />
        </ActionPanel>
      }
    >
      <Form.TextField title="Address" id="address" defaultValue="Google.com" />
      <Form.TextField title="Port" id="port" defaultValue="80" />
    </Form>
  );
};
