import path from "path";
import fs from "fs";
import { CHATWORK_TOKEN } from "../../ignore";

interface GetRoomRes {
  room_id: number;
  name: string;
  type: "my" | "direct" | "group";
  role: "member" | "admin" | "readonly";
  sticky: Boolean;
  unread_num: number;
  mention_num: number;
  mytask_num: number;
  message_num: number;
  file_num: number;
  task_num: number;
  icon_path: string;
  last_update_time: number;
}

class ChatManager {
  private Token: string;
  private baseUrl: string;

  constructor() {
    this.Token = CHATWORK_TOKEN;
    this.baseUrl = "https://api.chatwork.com/v2";
  }

  _createPathText(filePaths: string[]): string {
    const dirs: string[] = [];
    const files: Map<string, string[]> = new Map();

    filePaths.forEach((e) => {
      const dir = path.dirname(e);
      const base = path.basename(e);
      const stats = fs.statSync(e);

      if (!stats.isDirectory()) {
        files.set(dir, [...(files.get(dir) || []), base]);
        if (!dirs.includes(dir)) {
          dirs.push(dir);
        }
      } else {
        if (!dirs.includes(e)) {
          dirs.push(e);
        }
      }
    });

    let pathInfo = "";
    dirs.forEach((e) => {
      let fileInfo = "";
      const bases = files.get(e);
      if (bases) {
        bases.forEach((e) => {
          fileInfo += `\n・${e}`;
        });
      }
      pathInfo += `\n\n■ ${e}${fileInfo}`;
    });

    return pathInfo;
  }

  async getRooms(): Promise<Room[] | Err> {
    const endpoint = `${this.baseUrl}/rooms`;
    const headers = {
      "X-ChatWorkToken": this.Token,
    };

    try {
      const response = await fetch(endpoint, {
        method: "GET",
        headers,
      });
      if (!response.ok) {
        throw new Error(`Error fetching members: ${response.statusText}`);
      }
      const data = (await response.json()) as GetRoomRes[];
      const _data = data.filter((e) => e.type != "direct");
      const ret: Room[] = [];
      _data.forEach((e) => {
        ret.push({ name: e.name, id: e.room_id.toString(), icon: e.icon_path });
      });
      return ret;
    } catch (error) {
      console.error("Failed to fetch members:", error);
      const err: Err = { error: "", errorcode: "" };
      return err;
    }
  }

  async sendChat(
    room_id: string,
    message: string,
    filePaths: string[]
  ): Promise<{ id: string; msg: string } | Err> {
    const endpoint = `${this.baseUrl}/rooms/${room_id}/messages`;
    console.log(endpoint);
    const headers = {
      accept: "application/json",
      "X-ChatWorkToken": this.Token,
      "Content-Type": "application/x-www-form-urlencoded",
    };

    // const pathTextArr: string[] = filePaths.map((e) => this._createPathText(e));
    const pathText = this._createPathText(filePaths);

    const sendMsg = `${message}${pathText}`;
    const body = new URLSearchParams({
      body: `[info]${sendMsg}[/info]`,
      self_unread: "0",
    });

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers,
        body,
      });

      if (!response.ok) {
        throw new Error(`Error sending message: ${response.statusText}`);
      }

      const data = (await response.json()) as { message_id: string };
      return { id: data.message_id, msg: sendMsg };
    } catch (error) {
      console.error("Failed to send message:", error);
      const err: Err = { error: "", errorcode: "" };
      return err;
    }
  }

  async editChat(
    room_id: string,
    message_id: string,
    message: string
  ): Promise<string | Err> {
    const endpoint = `${this.baseUrl}/rooms/${room_id}/messages/${message_id}`;
    console.log(endpoint);
    const headers = {
      accept: "application/json",
      "X-ChatWorkToken": this.Token,
      "Content-Type": "application/x-www-form-urlencoded",
    };

    const body = new URLSearchParams({
      body: `[info]${message}[/info]`,
    });

    try {
      const response = await fetch(endpoint, {
        method: "PUT",
        headers,
        body,
      });

      if (!response.ok) {
        throw new Error(`Error sending message: ${response.statusText}`);
      }

      const data = (await response.json()) as { message_id: string };
      return data.message_id;
    } catch (error) {
      console.error("Failed to send message:", error);
      const err: Err = { error: "", errorcode: "" };
      return err;
    }
  }

  async deleteChat(room_id: string, message_id: string) {
    const endpoint = `${this.baseUrl}/rooms/${room_id}/messages/${message_id}`;
    console.log(endpoint);
    const headers = {
      accept: "application/json",
      "X-ChatWorkToken": this.Token,
      "Content-Type": "application/x-www-form-urlencoded",
    };

    try {
      const response = await fetch(endpoint, {
        method: "DELETE",
        headers,
      });

      if (!response.ok) {
        throw new Error(`Error delete message: ${response.statusText}`);
      }

      const data = (await response.json()) as { message_id: string };
      return data.message_id;
    } catch (error) {
      console.error("Failed to delete message:", error);
      const err: Err = { error: "", errorcode: "" };
      return err;
    }
  }
}

export default ChatManager;
