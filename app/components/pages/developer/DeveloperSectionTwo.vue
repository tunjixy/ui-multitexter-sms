<template>
  <section class="py-16 lg:py-24">
    <div class="wrapper">
      <ul class="grid gap-10 sm:grid-cols-3 sm:gap-8">
        <li
          v-for="(feature, index) in features"
          :key="feature.title"
          v-motion-slide-visible-once-bottom
          :delay="index * 100"
        >
          <span
            class="bg-primary/10 text-primary flex size-10 items-center justify-center rounded-xl"
          >
            <component :is="feature.icon" class="size-5" />
          </span>
          <h3 class="mt-4 text-base font-semibold">{{ feature.title }}</h3>
          <p class="text-muted-foreground mt-1.5 text-sm leading-relaxed">
            {{ feature.description }}
          </p>
        </li>
      </ul>

      <div
        class="mt-20 grid items-start gap-12 lg:mt-28 lg:grid-cols-[minmax(0,4fr)_minmax(0,8fr)] lg:gap-16"
      >
        <div class="lg:sticky lg:top-32">
          <p
            v-motion-fade-visible-once
            class="text-primary text-xs font-semibold tracking-[0.25em] uppercase"
          >
            Sample code
          </p>
          <h2
            v-motion-reveal
            :delay="100"
            class="mt-4 text-3xl leading-tight font-semibold tracking-tight text-balance sm:text-4xl"
          >
            Send your first SMS.
          </h2>
          <p
            v-motion-fade-visible-once
            :delay="300"
            class="text-muted-foreground mt-5 leading-relaxed"
          >
            Pick your language, fill in your account details and send a POST
            request with these parameters.
          </p>

          <dl
            v-motion-fade-visible-once
            :delay="450"
            class="divide-border border-border mt-8 divide-y border-y"
          >
            <div
              v-for="param in params"
              :key="param.name"
              class="flex flex-col gap-1 py-3"
            >
              <dt>
                <code class="text-primary font-mono text-[13px]">
                  {{ param.name }}
                </code>
              </dt>
              <dd class="text-muted-foreground text-sm">
                {{ param.description }}
              </dd>
            </div>
          </dl>
        </div>

        <div v-motion-slide-visible-once-bottom :delay="200" class="min-w-0">
          <UiTabs
            v-model="activeSample"
            :items="samples"
            variant="segmented"
            aria-label="Sample code language"
          >
            <template
              v-for="sample in samples"
              :key="sample.value"
              #[sample.value]
            >
              <div
                class="bg-dark-blue overflow-hidden rounded-2xl border border-white/10 text-white"
              >
                <div
                  class="flex h-11 items-center justify-between gap-3 border-b border-white/10 px-4"
                >
                  <div class="flex items-center gap-3">
                    <span aria-hidden="true" class="flex gap-1.5">
                      <span
                        v-for="dot in 3"
                        :key="dot"
                        class="size-2.5 rounded-full bg-white/15"
                      />
                    </span>
                    <span class="font-mono text-xs text-white/50">
                      {{ sample.file }}
                    </span>
                  </div>
                  <button
                    type="button"
                    class="focus-visible:ring-primary/40 flex h-7 cursor-pointer items-center gap-1.5 rounded-md px-2 text-xs font-medium text-white/60 transition-colors ease-in outline-none hover:bg-white/10 hover:text-white focus-visible:ring-2"
                    @click="copy(sample.code)"
                  >
                    <component :is="copied ? Check : Copy" class="size-3.5" />
                    {{ copied ? 'Copied' : 'Copy' }}
                  </button>
                </div>

                <div
                  class="overflow-x-auto py-4 font-mono text-[13px] leading-6"
                >
                  <div
                    v-for="(line, index) in sample.code.split('\n')"
                    :key="index"
                    class="flex w-max min-w-full"
                  >
                    <span
                      aria-hidden="true"
                      class="w-12 shrink-0 pr-4 text-right text-white/25 tabular-nums select-none"
                    >
                      {{ index + 1 }}
                    </span>
                    <span class="pr-6 whitespace-pre text-white/85">{{
                      line
                    }}</span>
                  </div>
                </div>
              </div>
            </template>
          </UiTabs>
        </div>
      </div>

      <div
        v-motion-slide-visible-once-bottom
        class="bg-surface border-border relative mt-20 overflow-hidden rounded-3xl border p-8 sm:p-10 lg:mt-28"
      >
        <div
          aria-hidden="true"
          class="bg-primary/10 pointer-events-none absolute -right-20 -bottom-28 size-72 rounded-full blur-3xl"
        />
        <div
          class="relative flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between"
        >
          <div class="max-w-md">
            <h2
              v-motion-reveal
              :delay="150"
              class="text-2xl font-semibold tracking-tight"
            >
              Need help integrating?
            </h2>
            <p
              v-motion-fade-visible-once
              :delay="350"
              class="text-muted-foreground mt-3 leading-relaxed"
            >
              Contact our support team if you run into any problems during
              integration.
            </p>
          </div>
          <a
            v-motion-fade-visible-once
            :delay="450"
            href="mailto:developer@multitexter.com"
            class="bg-primary text-dark-blue hover:bg-primary/85 focus-visible:ring-primary/40 inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-lg px-6 text-sm font-semibold transition-colors ease-in outline-none focus-visible:ring-3"
          >
            <Mail class="size-4" />
            developer@multitexter.com
          </a>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { Check, Code, Copy, LifeBuoy, Mail, Zap } from '@lucide/vue'

const features = [
  {
    icon: Code,
    title: 'Any language',
    description:
      'Works with PHP, Java, .NET, Visual Basic or anything that can send an HTTP request. XML is optional.',
  },
  {
    icon: LifeBuoy,
    title: 'Free integration support',
    description:
      'We help with PHP and Visual Basic 6 integrations for free, even if you have no programming skills.',
  },
  {
    icon: Zap,
    title: 'Set up in no time',
    description:
      'Several connection methods, so you can pick what fits your stack and start sending quickly.',
  },
]

const params = [
  { name: 'email', description: 'Your Multitexter registered email.' },
  { name: 'password', description: 'Your account password.' },
  { name: 'message', description: 'The message content.' },
  { name: 'sender_name', description: 'The sender name recipients see.' },
  {
    name: 'recipients',
    description:
      'Mobile numbers separated by commas, e.g. 2348028828288,234900002000.',
  },
  {
    name: 'forcednd',
    description: 'Set to 1 to deliver to DND numbers, otherwise 0.',
  },
]

const activeSample = ref('javascript')
const { copy, copied } = useClipboard({ copiedDuring: 2000, legacy: true })

const samples = [
  {
    value: 'javascript',
    label: 'JavaScript',
    file: 'send-sms.js',
    code: String.raw`const url = 'https://app.multitexter.com/v2/app/sms'

const data = {
  email: 'your multitexter registered email',
  password: 'your password',
  message: 'message content',
  sender_name: 'your sender name',
  recipients: 'mobile numbers separated by comma e.g. 2348028828288,234900002000,234808887800',
  forcednd: 'set to 1 if you want DND numbers to receive message otherwise set to zero',
}

fetch(url, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(data),
})
  .then((response) => response.json())
  .then((result) => console.log(result))
  .catch((error) => console.error(error))`,
  },
  {
    value: 'php',
    label: 'PHP',
    file: 'send-sms.php',
    code: String.raw`<?php

$email = "your multitexter registered email";
$password = "your password";
$message = "message content";
$sender_name = "your sender name";
$recipients = "mobile numbers separated by comma e.g. 2348028828288,234900002000,234808887800";
$forcednd = "set to 1 if you want DND numbers to receive message otherwise set to zero";

$data = array(
    "email" => $email,
    "password" => $password,
    "message" => $message,
    "sender_name" => $sender_name,
    "recipients" => $recipients,
    "forcednd" => $forcednd
);
$data_string = json_encode($data);

$ch = curl_init('https://app.multitexter.com/v2/app/sms');
curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "POST");
curl_setopt($ch, CURLOPT_POSTFIELDS, $data_string);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, array(
    'Content-Type: application/json',
    'Content-Length: ' . strlen($data_string)
));

$result = curl_exec($ch);
$res_array = json_decode($result);
print_r($res_array);
?>`,
  },
  {
    value: 'java',
    label: 'Java',
    file: 'Main.java',
    code: String.raw`import java.net.*;
import java.io.*;

public class Main {
    public static void main(String[] args) {
        try {
            String query = "https://app.multitexter.com/v2/app/sms";
            String email = "your multitexter registered email";
            String password = "your password";
            String message = "message content";
            String sender_name = "your sender name";
            String recipients = "mobile numbers separated by comma e.g. 2348028828288,234900002000,234808887800";
            String forcednd = "set to 1 if you want DND numbers to receive message otherwise set to zero";
            String param = "{\"email\":\"" + email + "\",\"password\":\"" + password + "\",\"message\":\"" + message + "\",\"sender_name\":\"" + sender_name + "\",\"recipients\":\"" + recipients + "\",\"forcednd\":\"" + forcednd + "\"}";

            URL url = new URL(query);
            HttpURLConnection conn = (HttpURLConnection) url.openConnection();
            conn.setConnectTimeout(5000);
            conn.setRequestProperty("Content-Type", "application/json; charset=UTF-8");
            conn.addRequestProperty("User-Agent", "Mozilla/5.0 (Windows NT 6.1; WOW64; rv:25.0) Gecko/20100101 Firefox/25.0");
            conn.setDoOutput(true);
            conn.setDoInput(true);
            conn.setRequestMethod("POST");

            OutputStream os = conn.getOutputStream();
            os.write(param.getBytes("UTF-8"));
            os.close();

            BufferedReader in = new BufferedReader(new InputStreamReader(conn.getInputStream()));
            String inputLine;
            StringBuffer response = new StringBuffer();
            while ((inputLine = in.readLine()) != null) {
                response.append(inputLine);
            }
            in.close();
            conn.disconnect();

            System.out.println(response);
        } catch (Exception e) {
            System.out.println(e.toString());
        }
    }
}`,
  },
  {
    value: 'csharp',
    label: 'C#',
    file: 'Program.cs',
    code: String.raw`using System;
using System.IO;
using System.Net;

namespace Multitexter
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var httpWebRequest = (HttpWebRequest)WebRequest.Create("https://app.multitexter.com/v2/app/sms");
            httpWebRequest.ContentType = "application/json";
            httpWebRequest.Method = "POST";
            ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12 | SecurityProtocolType.Tls11 | SecurityProtocolType.Tls;

            using (var streamWriter = new StreamWriter(httpWebRequest.GetRequestStream()))
            {
                string email = "your multitexter registered email";
                string password = "your password";
                string message = "message content";
                string sender_name = "your sender name";
                string recipients = "mobile numbers separated by comma e.g. 2348028828288,234900002000,234808887800";
                string forcednd = "set to 1 if you want DND numbers to receive message otherwise set to zero";
                string json = "{\"email\":\"" + email + "\",\"password\":\"" + password + "\",\"message\":\"" + message + "\",\"sender_name\":\"" + sender_name + "\",\"recipients\":\"" + recipients + "\",\"forcednd\":\"" + forcednd + "\"}";
                streamWriter.Write(json);
                streamWriter.Flush();
            }

            var httpResponse = (HttpWebResponse)httpWebRequest.GetResponse();
            using (var streamReader = new StreamReader(httpResponse.GetResponseStream()))
            {
                var result = streamReader.ReadToEnd();
                Console.WriteLine(result);
            }
        }
    }
}`,
  },
]
</script>
