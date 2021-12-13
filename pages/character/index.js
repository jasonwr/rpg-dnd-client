import {Divider} from '@chakra-ui/react'
import {useRouter} from 'next/router'
import React from 'react'
import {CharacterStats} from '../../components/CharacterStats'
import { Summary } from '../../components/CharacterSummary'
import {DndAccordion} from '../../components/DndAccordion'
import {SkillStats} from '../../components/SkillStats'
import {SpecialStats} from '../../components/SpecialStats'
import {SpellStats} from '../../components/SpellStats'
import {context} from '../../context/providers'
import {characterUtils} from '../../utils'

const Title = ({children}) => (
  <div>
    <h5>{children}</h5>
  </div>
)

export default function Character() {
  const router = useRouter()
  let {state: {character, isLoggedIn}} = React.useContext(context);

  React.useEffect(() => {
    if (!isLoggedIn) {
      router.push('/')
    }
  })

  if (!isLoggedIn) return null;

  // TODO: fetch all this mocked up data from the database
  const hp = {current: 15, total: 50}

  const characterConditions = [
    {icon: 'poison', color: 'green'},
    {icon: 'web'}
  ]

  const weatherConditions = [
    {icon: 'sunny', color: 'orange'},
  ]

  const parsedCharacter = characterUtils.parseCharacter(character)
  const {name, races, skills} = parsedCharacter

  return (
    <>
    {/*<Summary*/}
    {/*  characterConditions={characterConditions}*/}
    {/*  weatherConditions={weatherConditions}*/}
    {/*  hp={hp}*/}
    {/*  name={"Legolas"}*/}
    {/*/>*/}

      <>
        <DndAccordion title={<Title>{name}</Title>}>
          {races}
          <Divider/>
          <CharacterStats character={parsedCharacter}/>
          <Divider/>
        </DndAccordion>
        <DndAccordion title={<Title>Skills</Title>}>
          <SkillStats skills={skills}/>
        </DndAccordion>
        <DndAccordion title={<Title>Specials</Title>}>
          <SpecialStats character={parsedCharacter}/>
        </DndAccordion>
        <DndAccordion title={<Title>Spells</Title>}>
          <SpellStats character={parsedCharacter}/>
        </DndAccordion>
      </>
    </>
  )
}