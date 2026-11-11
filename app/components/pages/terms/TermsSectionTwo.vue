<template>
  <section
      class="wrapper grid gap-12 py-16 lg:grid-cols-[13rem_minmax(0,1fr)] lg:gap-20 lg:py-24"
    >
      <aside class="hidden lg:block">
        <nav aria-label="On this page" class="sticky top-32">
          <p
            class="text-muted-foreground text-xs font-semibold tracking-[0.2em] uppercase"
          >
            On this page
          </p>
          <ol class="border-border mt-5 border-l">
            <li v-for="(section, index) in sections" :key="section.id">
              <a
                :href="`#${section.id}`"
                :aria-current="activeId === section.id ? 'location' : undefined"
                :class="[
                  '-ml-px flex items-baseline gap-3 border-l py-2 pl-4 text-sm transition-colors ease-in',
                  activeId === section.id
                    ? 'border-primary text-foreground font-medium'
                    : 'text-muted-foreground hover:text-foreground border-transparent',
                ]"
                @click="activeId = section.id"
              >
                <span class="text-xs tabular-nums opacity-60">
                  {{ formatIndex(index) }}
                </span>
                {{ section.title }}
              </a>
            </li>
          </ol>
        </nav>
      </aside>

      <div class="divide-border max-w-3xl divide-y">
        <section id="acceptance" class="scroll-mt-24 pb-12">
          <div class="flex items-baseline gap-4">
            <span class="text-primary text-sm font-semibold tabular-nums">
              01
            </span>
            <h2 class="text-2xl font-semibold tracking-tight">Acceptance</h2>
          </div>

          <div
            class="border-primary/25 bg-primary/5 mt-8 rounded-2xl border p-6 sm:p-8"
          >
            <p
              class="text-primary flex items-center gap-2 text-xs font-semibold tracking-[0.2em] uppercase"
            >
              <Scale class="size-4" />
              Read carefully
            </p>
            <div
              class="mt-5 space-y-4 text-sm leading-relaxed font-medium tracking-wide"
            >
              <p>
                PLEASE REVIEW THESE TERMS CAREFULLY. ONCE ACCEPTED, THESE TERMS
                BECOME A BINDING LEGAL COMMITMENT BETWEEN YOU AND MultiTexter
                BulkSMS. IF YOU DO NOT AGREE TO BE BOUND BY THESE TERMS, YOU
                SHOULD NOT CLICK THE “Register Now” BUTTON AND YOU SHOULD NOT
                USE MultiTexter BulkSMS SERVICES.
              </p>
              <p>
                IMPORTANT NOTE: MultiTexter BulkSMS DOES NOT PROVIDE WARRANTIES
                FOR ITS SERVICES, AND THESE TERMS LIMIT OUR LIABILITY TO YOU. IN
                ADDITION, DISPUTES ABOUT THESE TERMS OR RELATING TO YOUR
                MultiTexter BulkSMS ACCOUNT OR MultiTexter BulkSMS’S SERVICES
                GENERALLY MUST BE RESOLVED BY BINDING ARBITRATION AND ON AN
                INDIVIDUAL BASIS ONLY.
              </p>
            </div>
          </div>
        </section>

        <section id="responsibilities" class="scroll-mt-24 py-12">
          <div class="flex items-baseline gap-4">
            <span class="text-primary text-sm font-semibold tabular-nums">
              02
            </span>
            <h2 class="text-2xl font-semibold tracking-tight">
              Your Responsibilities
            </h2>
          </div>

          <ul class="mt-8 space-y-5">
            <li
              v-for="(item, index) in responsibilities"
              :key="index"
              class="flex gap-4"
            >
              <span class="bg-primary mt-2.5 size-1.5 shrink-0 rounded-full" />
              <span class="text-muted-foreground leading-relaxed">
                {{ item }}
              </span>
            </li>
          </ul>
          <p class="text-muted-foreground mt-8 leading-relaxed">
            Constant improvement is very important to us and that’s why we are
            here for you.
          </p>
        </section>

        <section id="general-conditions" class="scroll-mt-24 py-12">
          <div class="flex items-baseline gap-4">
            <span class="text-primary text-sm font-semibold tabular-nums">
              03
            </span>
            <h2 class="text-2xl font-semibold tracking-tight">
              General Conditions
            </h2>
          </div>

          <ul class="mt-8 space-y-5">
            <li
              v-for="(item, index) in conditions"
              :key="index"
              class="flex gap-4"
            >
              <span class="bg-primary mt-2.5 size-1.5 shrink-0 rounded-full" />
              <span class="text-muted-foreground leading-relaxed">
                {{ item }}
              </span>
            </li>
          </ul>
          <p class="text-muted-foreground mt-8 leading-relaxed">
            You understand and agree that your use MultiTexter BulkSMS and it's
            Services at your own discretion and risk and that you will be solely
            responsible for any damages that arise from such use. Under no
            circumstances shall MultiTexter BulkSMS be liable for any direct,
            indirect, special, incidental, consequential or punitive damages of
            any kind, or any other damages whatsoever (however arising,
            including by negligence), including without limitation, damages
            related to use, misuse, reliance on, inability to use and
            interruption, suspension, or termination of the site or services,
            damages incurred through any links provided on the site and the
            non-performance thereof and damages resulting from loss of use,
            sales, data, goodwill or profits, whether or not MultiTexter BulkSMS
            has been advised of such possibility.
          </p>

          <div
            class="bg-surface border-border mt-8 flex gap-4 rounded-2xl border p-6"
          >
            <TriangleAlert class="text-primary mt-0.5 size-5 shrink-0" />
            <p class="text-sm leading-relaxed font-medium tracking-wide">
              MultiTexter BulkSMS SERVICES ARE NOT INTENDED TO SUPPORT OR CARRY
              EMERGENCY CALLS OR SMS MESSAGES TO ANY EMERGENCY SERVICES. NEITHER
              MultiTexter BulkSMS NOR ITS REPRESENTATIVES WILL BE LIABLE UNDER
              ANY LEGAL OR EQUITABLE THEORY FOR ANY CLAIM, DAMAGE, OR LOSS (AND
              CUSTOMER WILL HOLD MultiTexter BulkSMS HARMLESS AGAINST ANY AND ALL
              SUCH CLAIMS) ARISING FROM OR RELATING TO THE INABILITY TO USE OUR
              SERVICES TO CONTACT EMERGENCY SERVICES.
            </p>
          </div>
        </section>

        <section id="assignment" class="scroll-mt-24 py-12">
          <div class="flex items-baseline gap-4">
            <span class="text-primary text-sm font-semibold tabular-nums">
              04
            </span>
            <h2 class="text-2xl font-semibold tracking-tight">Assignment</h2>
          </div>

          <p class="text-muted-foreground mt-6 leading-relaxed">
            You will not assign or otherwise transfer these Terms, in whole or
            in part, without our prior written consent. Any attempt by you to
            assign, delegate, or transfer these Terms will be null and void.
            Subject to this Section 16.3, these Terms will be binding on both
            you and MultiTexter BulkSMS and each of our successors and assigns.
          </p>
        </section>

        <section id="indemnification" class="scroll-mt-24 py-12">
          <div class="flex items-baseline gap-4">
            <span class="text-primary text-sm font-semibold tabular-nums">
              05
            </span>
            <h2 class="text-2xl font-semibold tracking-tight">
              Indemnification
            </h2>
          </div>

          <div class="text-muted-foreground mt-6 space-y-4 leading-relaxed">
            <p>
              You will defend, indemnify and hold MultiTexter BulkSMS and its
              affiliates harmless against any actual or threatened claim, loss,
              liability, proceeding, third-party discovery demand, governmental
              investigation or enforcement action arising out of or relating to
              your activities under these Terms or your acts or omissions in
              connection with the provision of Your Application, including,
              without limitation, any intellectual property claims relating to
              the Your Application and any violation by you or your End Users of
              the terms of the General Conditions. We and our affiliates will
              cooperate as fully as reasonably required in the defense of any
              Claim, at your expense. We reserve the right, at your expense, to
              retain separate counsel for ourselves in connection with any Claim
              or, if you have not responded reasonably to the applicable Claim,
              to assume the exclusive defense and control of any Claim in which
              you are a named party and that is otherwise subject to
              indemnification. You will pay all costs, reasonable attorneys’
              fees and any settlement amounts or damages awarded against us in
              connection with any Claim. You will also be liable to us for any
              costs and attorneys’ fees we incur to successfully establish or
              enforce our right to indemnification under this Section.
            </p>
            <p>
              Your only right with respect to any dissatisfaction with this site
              or services or with MultiTexter BulkSMS shall be to terminate use
              of this site and services.
            </p>
          </div>
        </section>

        <section id="contact" class="scroll-mt-24 pt-12">
          <div
            class="bg-surface border-border relative overflow-hidden rounded-3xl border p-8 sm:p-10"
          >
            <div
              aria-hidden="true"
              class="bg-primary/10 pointer-events-none absolute -right-20 -bottom-28 size-72 rounded-full blur-3xl"
            />
            <div
              class="relative flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between"
            >
              <div class="max-w-md">
                <span class="text-primary text-sm font-semibold tabular-nums">
                  06
                </span>
                <h2 class="mt-2 text-2xl font-semibold tracking-tight">
                  Questions about these terms?
                </h2>
                <p class="text-muted-foreground mt-3 leading-relaxed">
                  If you have any issues about the above terms and conditions,
                  please send us an email.
                </p>
              </div>
              <a
                href="mailto:info@multitexter.com"
                class="bg-primary text-dark-blue hover:bg-primary/85 focus-visible:ring-primary/40 inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-lg px-6 text-sm font-semibold transition-colors ease-in outline-none focus-visible:ring-3"
              >
                <Mail class="size-4" />
                info@multitexter.com
              </a>
            </div>
          </div>
        </section>
      </div>
    </section>
</template>

<script setup lang="ts">
import { Mail, Scale, TriangleAlert } from '@lucide/vue'

const sections = [
  { id: 'acceptance', title: 'Acceptance' },
  { id: 'responsibilities', title: 'Your Responsibilities' },
  { id: 'general-conditions', title: 'General Conditions' },
  { id: 'assignment', title: 'Assignment' },
  { id: 'indemnification', title: 'Indemnification' },
  { id: 'contact', title: 'Contact' },
]

const activeId = ref('acceptance')
const sectionEls = ref<HTMLElement[]>([])

const formatIndex = (index: number) => String(index + 1).padStart(2, '0')

onMounted(() => {
  sectionEls.value = sections
    .map(({ id }) => document.getElementById(id))
    .filter((el): el is HTMLElement => el !== null)
})

useIntersectionObserver(
  sectionEls,
  (entries) => {
    const visible = entries.find((entry) => entry.isIntersecting)
    if (visible) activeId.value = visible.target.id
  },
  { rootMargin: '-30% 0px -65% 0px' },
)

const responsibilities = [
  'You must be 18 years or older to use this site.',
  'You are responsible for keeping your password secure.',
  'You may not use the MultiTexter BulkSMS service for any illegal or unauthorized purpose. International users agree to comply with all local laws regarding online conduct and acceptable content.',
  'You are solely responsible for your conduct and any data, text, information, screen names, or Content that you submit, post, and display on the MultiTexter BulkSMS service.',
  'You must not modify, adapt or hack MultiTexter BulkSMS or modify another website so as to falsely imply that it is associated with MultiTexter BulkSMS',
  'You must not create or submit fraudulent (SCAM), or unwanted (SPAM) SMS using our platform.',
  'You must not transmit any worms or viruses or any code of a destructive nature.',
  'You are solely responsible for your use of the Site and Services. MultiTexter BulkSMS may archive links to third-party websites. The linked websites content, business practices and privacy policies are not under our control, and we are not responsible for the content of any linked website or any link contained in a linked website. The inclusion of a link on the Site or Services does not imply any endorsement by or any affiliation with MultiTexter BulkSMS. In accessing the Site and Services or following links to third-party websites you may be exposed to content that you consider offensive or inappropriate. You agree that your only recourse is to stop using the Site and Services',
  'You must not, in the use of MultiTexter BulkSMS, violate any laws in your jurisdiction (including but not limited to copyright laws). Violation of any of these agreements will result in the termination of your MultiTexter BulkSMS account.',
  'You must complete the registration process providing only true and accurate information as lined out on the registration form to open an account. You are responsible for the privacy and confidentiality of username and password. Also, you are wholly responsible for all activities that occur under your account. We will not be held liable to any third party claims and/or actions taken with respect to services offered. You agree to notify us immediately of any unauthorized access or use of your account.',
]

const conditions = [
  'We reserve the right to modify or terminate the MultiTexter BulkSMS service for any reason, without notice at any time.',
  'We reserve the right to alter these Terms of Use at any time.',
  'We reserve the right to modify prices, charges or fees at any time. Any changes shall be posted on MultiTexter BulkSMS pricing page with or without prior notification.',
  'We will NOT provide you a refund for any charges made on your credit card, debit card or any payments. You agree that all payment for services are final and non-refundable. You are responsible for all charges resulting from the use of MultiTexter BulkSMS.',
  'We reserve the right, in accordance with any applicable laws, to refuse service to anyone for any reason at any time.',
  "We may, but have no obligation to, remove Content and accounts containing Content that we determine in our sole discretion are unlawful, offensive, threatening, libellous, defamatory, obscene or otherwise objectionable or violates any party's intellectual property or these Terms of Use.",
  'MultiTexter BulkSMS and you are independent entities, and nothing in the Terms, or via use of the Site or Services, will create any partnership, joint venture, agency, franchise, sales representative, or employment relationship between MultiTexter BulkSMS and you.',
  'MultiTexter BulkSMS reserves the right at any time and from time to time to modify or discontinue, temporarily or permanently, the Service (or any part thereof) with or without notice. You agree that MultiTexter BulkSMS shall not be liable to you or to any third party for any modification, suspension or discontinuance of the Service.',
]
</script>