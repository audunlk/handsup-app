import React, {useEffect, useState} from 'react'
import { View, Text } from 'react-native'
import { getAnswerChoices } from '../services/pollSetup'
import { ISOtoReadable } from '../utils/dateConversion';

{/* <PollCard poll={item} /> */}

export default function PollCard( {route} ) {
  const [answers, setAnswers] = useState([]);
  const [creationDate, setCreationDate] = useState([]);
  const [respondBy, setRespondBy] = useState([]);
  const { poll } = route.params;

  const getAnswers = async (id: Number) => {
    const answerChoices = await getAnswerChoices(id);
    setAnswers(answerChoices);
    setCreationDate(ISOtoReadable(poll.created_at));
    setRespondBy(ISOtoReadable(poll.respond_by));
    
  }


  useEffect(() => {
    console.log({poll})
    getAnswers(poll.id);
    console.log({answers})
  }, [poll])


  return (
    <View style={
      {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        alignSelf: "center",

      }
    }>
        <Text>{poll.question}</Text>
        <Text style={{color: 'red'}}>{poll.description}</Text>
        <Text>Created At:</Text>
        <Text>{creationDate[0]}</Text>
        <Text>{creationDate[1]}</Text>
        <Text>Respond By:</Text>
        <Text>{respondBy[0]}</Text>
        <Text>{respondBy[1]}</Text>
        <Text>{poll.group_id}</Text>
        {answers.map((answer, index) => {
          return (
            <Text key={index}>{answer.text}</Text>
          )
        })
        }
    </View>
  )
}
 