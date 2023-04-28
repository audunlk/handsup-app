import React, {useEffect, useState} from 'react'
import {View, Text, Dimensions, StyleSheet, SafeAreaView} from 'react-native'
import { PieChart } from 'react-native-chart-kit'
import Modal from 'react-native-modal'




export default function PollResults({poll, isVisible, setIsVisible}) {
    const [answers, setAnswers] = useState(poll.answer_choices.map((answer: any) => answer) as any)
    const [votes, setVotes] = useState([])
    const [totalVotes, setTotalVotes] = useState(poll.answer_choices.map((answer: any) => answer.votes).reduce((a, b) => a + b, 0))

    useEffect(() => {
        handleVotesPerAnswerOption()
        console.log(votes)
        
    }, [ poll.membersAnswered])

    const handleVotesPerAnswerOption = () => {
        const votesPerAnswer = poll.membersAnswered.reduce((acc: any, curr: any) => {
            const user = curr.user.firstName
            const answer = curr.answer
            if (acc[answer]) {
                acc[answer].votes += 1
                acc[answer].voters.push(user)
            } else {
                acc[answer] = {
                    votes: 1,
                    voters: [user]
                }
            }
            return acc
        }
        , {})
        setVotes(votesPerAnswer)

    }



    


  return (
    <Modal
    isVisible={isVisible}
            style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
            animationIn={'zoomIn'}
            backdropOpacity={0.9}
            animationInTiming={500}
            animationOutTiming={500}
            hideModalContentWhileAnimating={true}
            onBackdropPress={() => setIsVisible(null)}
    >

      <View style={styles.header}>
        <Text style={styles.headerText}>Polling Results</Text>
      </View>
      {/* <PieChart
        data={answers}
        width={Dimensions.get('window').width / 2}
        height={220}
        chartConfig={{
            backgroundColor: '#fff',
            backgroundGradientFrom: '#fff',
            backgroundGradientTo: '#fff',
            decimalPlaces: 2,
            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
        }}
        accessor="votes"
        backgroundColor="transparent"
        paddingLeft="15"
        absolute
        style={styles.chart}
      /> */}
    </Modal>
  );
}



const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    },
    header: {
      backgroundColor: '#fff',
      height: 60,
      width: '100%',
      borderBottomWidth: 0.5,
      borderBottomColor: '#ccc',
      justifyContent: 'center',
      alignItems: 'center',
    },
    headerText: {
      fontSize: 20,
      fontWeight: 'bold',
    },
    chart: {
      marginTop: 20,
      borderRadius: 16,
    },
  });