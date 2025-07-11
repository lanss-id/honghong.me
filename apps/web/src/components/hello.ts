'use client'

import { useEffect } from 'react'

const Hello = () => {
  useEffect(() => {
    console.log(
      `\
%cHey there, awesome developer!

If you're digging this code, check out my GitHub repo:

https://github.com/tszhong0411/nelsonlai.me

and give it a star ⭐
`,
      'font-size: 16px'
    )
  }, [])

  return null
}

export default Hello
