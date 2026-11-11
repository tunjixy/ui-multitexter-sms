export default function useComposeMessage(
  recipientField: Ref<string>,
  messageField?: Ref<string>,
) {
  const maxCharacter = ref(160)
  const page = ref(1)
  const reservedWords = [
    {
      name: 'vote',
      word: 'vo te',
    },
    {
      name: 'VOTE',
      word: 'VO TE',
    },
    {
      name: 'pdp',
      word: 'P.DP',
    },
    {
      name: 'ANDP',
      word: 'AN.DP',
    },
    {
      name: 'apc',
      word: 'A.PC',
    },
    {
      name: 'abp',
      word: 'A.BP',
    },
    {
      name: 'gpn',
      word: 'G.PN',
    },
    {
      name: 'sdp',
      word: 'S.DP',
    },
    {
      name: 'mpn',
      word: 'M.PN',
    },
    {
      name: 'acd',
      word: 'A.CD',
    },
    {
      name: 'nup',
      word: 'N.UP',
    },
    /* {
          name: 'apa',
          word: 'A.PA',
        }, */
    {
      name: 'ypp',
      word: 'Y.PP',
    },
    {
      name: 'dpp',
      word: 'D.PP',
    },
    {
      name: 'acpn',
      word: 'AC.PN',
    },
    {
      name: 'ncp',
      word: 'N.CP',
    },
    {
      name: 'nnpp',
      word: 'NN.PP',
    },
    {
      name: 'fdp',
      word: 'F.DP',
    },
    {
      name: 'andp',
      word: 'AN.DP',
    },
    {
      name: 'Promo',
      word: 'Promo',
    },
    {
      name: 'Mtn',
      word: 'MT.N',
    },
    {
      name: 'Account',
      word: 'Acc',
    },
  ]

  const count = computed(() => {
    return messageField?.value.length as number
  })

  const totalRecipients = computed(() => {
    return recipientField.value === ''
      ? 0
      : recipientField.value.split(',').length
  })

  const onlyAlphabets = (event: KeyboardEvent) => {
    if (!/^[A-Za-z\s]+$/.test(event.key)) return event.preventDefault()
  }

  const formatRecipients = () => {
    const recipientNumbers: string[] = []

    const splittedNumbers = recipientField.value
      ? recipientField.value.replace(/\s+/g, ',').split(',')
      : ''

    // Un-split recipient numbers
    for (let i = 0; i < splittedNumbers.length; i++) {
      recipientNumbers.push(splittedNumbers[i]!.replace(/\D/g, ''))
    }

    // Filter recipients number
    const filteredRecipientNumbers = recipientNumbers.filter((item) => {
      return item.length === 10 || item.length === 11 || item.length === 13
    })

    // Add 234 prefix to numbers that don't have
    const prefixedWith234: string[] = []
    filteredRecipientNumbers.forEach((number) => {
      if (
        number.startsWith('70') ||
        number.startsWith('90') ||
        number.startsWith('80') ||
        number.startsWith('81') ||
        number.startsWith('91 ')
      ) {
        prefixedWith234.push(number.replace(/^/, '234'))
      } else {
        prefixedWith234.push(number)
      }
    })

    // Sort duplicate numbers
    const sortDuplicateNumbers = prefixedWith234.filter(
      (item, index) => prefixedWith234.indexOf(item) === index,
    )

    // Filter out number not to include
    const numbersNotDeliveredTo = sortDuplicateNumbers.filter((number) => {
      return (
        !number.startsWith('234709') &&
        !number.startsWith('2347027') &&
        !number.startsWith('234804') &&
        !number.startsWith('2347028') &&
        !number.startsWith('2347029') &&
        !number.startsWith('234819') &&
        !number.startsWith('07027') &&
        !number.startsWith('0709') &&
        !number.startsWith('0804') &&
        !number.startsWith('07028') &&
        !number.startsWith('07029') &&
        !number.startsWith('0819')
      )
    })

    recipientField.value = numbersNotDeliveredTo.toString()
  }

  const checkMessageLength = () => {
    if (count.value <= 160) {
      page.value = 1
      maxCharacter.value = 160
    } else if (count.value > 160 && count.value <= 306) {
      page.value = 2
      maxCharacter.value = 306
    } else if (count.value > 306 && count.value <= 459) {
      page.value = 3
      maxCharacter.value = 459
    } else if (count.value > 459 && count.value <= 612) {
      page.value = 4
      maxCharacter.value = 612
    } else if (count.value > 612 && count.value <= 765) {
      page.value = 5
      maxCharacter.value = 765
    } else if (count.value > 765 && count.value <= 918) {
      page.value = 6
      maxCharacter.value = 918
    } else if (count.value > 918 && count.value <= 1071) {
      page.value = 7
      maxCharacter.value = 1071
    } else if (count.value > 1071 && count.value <= 1224) {
      page.value = 8
      maxCharacter.value = 1224
    }
  }

  const replaceKeyword = () => {
    if (messageField !== undefined) {
      reservedWords.forEach((item) => {
        const pattern = new RegExp(item.name, 'gi')
        const formattedMessage = messageField.value.replace(pattern, item.word)
        messageField.value = formattedMessage
      })
    }
  }

  return {
    count,
    maxCharacter,
    page,
    totalRecipients,
    formatRecipients,
    checkMessageLength,
    replaceKeyword,
    onlyAlphabets,
  }
}
