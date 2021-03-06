# RedisStore

A library for Redis datastores on
[assistant lib](https://github.com/Assistant-Bot/Lib).

This library is seperated from the
[core library](https://github.com/Assistant-Bot/Lib) because it contains a 3rd
party dependency!

## How to use?

Please note that this implementation is not final, and will change from
[this issue](https://github.com/Assistant-Bot/Lib/issues/35)

```ts
import { RedisDataStore } from "https://raw.githubusercontent.com/Assistant-Bot/RedisStore/master/mod.ts";
import { Client, Member } from "https://deno.land/x/assistantlib/mod.ts";

const bot: Client = new Client({}, RedisDataStore);

// First way to get a member
const member: Member = await bot.guilds.get("id", {
  member: { id: "MEMBER_ID" },
});

// Second way
const member: Member = await bot.guilds.get("id").members.get("id");

// Third way
const member: Member = bot.guilds.getSync("id").members.get("id");
```
