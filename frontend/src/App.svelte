<script lang="ts">
  import { sendMessage, fetchHistory } from "./lib/api";

  type Message = {
    sender: "user" | "ai";
    text: string;
  };

  let messages: Message[] = [];
  let input = "";
  let loading = false;

  let sessionId: string | undefined =
    localStorage.getItem("sessionId") ?? undefined;

  if (sessionId) {
    fetchHistory(sessionId)
      .then((history) => {
        messages = history;
      })
      .catch(() => {
        messages = [];
      });
  }

  async function submit() {
    if (!input.trim() || loading) return;

    const userText = input.trim();
    input = "";

    messages = [...messages, { sender: "user", text: userText }];
    loading = true;

    try {
      const res = await sendMessage(userText, sessionId);
      sessionId = res.sessionId;
      localStorage.setItem("sessionId", sessionId);
      messages = [...messages, { sender: "ai", text: res.reply }];
    } catch {
      messages = [
        ...messages,
        { sender: "ai", text: "Something went wrong." }
      ];
    } finally {
      loading = false;
    }
  }
</script>

<main class="chat">
  <div class="messages">
    {#each messages as m}
      <div class="message {m.sender}">
        {m.text}
      </div>
    {/each}

    {#if loading}
      <div class="message ai typing">Agent is typing…</div>
    {/if}
  </div>

  <div class="input-row">
    <input
      bind:value={input}
      placeholder="Type your message…"
      on:keydown={(e) => e.key === "Enter" && submit()}
    />
    <button on:click={submit} disabled={loading}>
      Send
    </button>
  </div>
</main>

<style>
  .chat {
    max-width: 420px;
    margin: auto;
    display: flex;
    flex-direction: column;
    height: 600px;
    border: 1px solid #ddd;
  }

  .messages {
    flex: 1;
    overflow-y: auto;
    padding: 12px;
  }

  .message {
    margin-bottom: 8px;
    padding: 8px 10px;
    border-radius: 6px;
    max-width: 80%;
  }

  .user {
    margin-left: auto;
    background: #e6f0ff;
  }

  .ai {
    margin-right: auto;
    background: #f4f4f4;
  }

  .typing {
    opacity: 0.6;
    font-style: italic;
  }

  .input-row {
    display: flex;
    padding: 10px;
    gap: 8px;
    border-top: 1px solid #ddd;
  }

  input {
    flex: 1;
    padding: 8px;
  }
</style>
