import {useRouter} from 'next/router'
import * as React from 'react'
import {SkillTable} from '../../components'
import {useRpgContext} from '../../context/providers'

export default function Lore() {
  const router = useRouter()
  let {state} = useRpgContext()
  const { isLoggedIn } = state

  React.useEffect(() => {
    if (!isLoggedIn) {
      router.push('/', undefined, { shallow: true })
    }
  })

  return (
    <div>
      <h1>LORE PAGE</h1>
      <SkillTable/>
    </div>
  )
}
