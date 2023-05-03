import React, {useEffect, useState} from 'react'
import {View, Text, Dimensions, StyleSheet} from 'react-native'
import Modal from 'react-native-modal'
import { getAnswersByPollId, getUserObject } from '../services/firebaseRequests'
import Loading from '../screens/Loading'




export default function PollResults({poll, team, isVisible, setIsVisible}) {
  const [answers, setAnswers] = useState([])
  const [answerOptions, setAnswerOptions] = useState(poll.answers)
  const [users, setUsers] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [countMap, setCountMap] = useState({})
  const [isAdmin, setIsAdmin] = useState(false)
  const [totalVotes, setTotalVotes] = useState(0)

  useEffect(() => {
    setIsLoading(true)
    getAnswers()
    setIsLoading(false)
  }, [poll, team])

  useEffect(() => {
    async function fetchUsers() {
      setIsLoading(true)
      try{
        const userPromises = answers.map((answer) => getUserObject(answer.userId));
        const users = await Promise.all(userPromises);
      setUsers(users);
      }catch(err){
        setError(err.message)
      }finally{
        handleCountVotes()
        setIsLoading(false)
      }
    }
    fetchUsers();
  }, [answers]);

  const getAnswers = async () => {
    try{
      const answers = await getAnswersByPollId(poll.id)
      setAnswers(answers)
      console.log(answers)
      setTotalVotes(answers.length)
    }
    catch(err){
      setError(err.message)
    }finally{
      setIsLoading(false)
    }
  }

  const handleCountVotes = () =>{
    const count = Array(answerOptions.length).fill(0);
    answers.forEach((answer) => {
      const answerIndex = answer.answerIndex;
      count[answerIndex]++;
    });
    console.log(count)
    const countMap = count.reduce((acc, curr, idx) => {
      acc[answerOptions[idx]] = curr;
      return acc;
    }, {});
    console.log(countMap)
    setCountMap(countMap);
  }

  const Chart = () => {
    return (
      <View style={styles.container}>
      <Text style={styles.header}>{poll.question}</Text>
      {Object.entries(countMap).map(([key, value]) => (
        <View key={key} style={styles.item}>
          <View style={[styles.bar, { width: (+value / totalVotes) * 100 + '%' }]} />
          <View style={styles.labels}>
            <Text style={styles.label}>{key}</Text>
            <Text style={[styles.percentLabel]}>{((+value / totalVotes) * 100).toFixed(1)}%</Text>
          </View>
        </View>
      ))}
      <Text style={styles.footer}>{totalVotes} votes</Text>
    </View>
    );
  };

  isLoading && <Loading />

  return (
    <Modal
    isVisible={isVisible}
            animationIn={'zoomIn'}
            backdropOpacity={0.9}
            animationInTiming={500}
            animationOutTiming={500}
            hideModalContentWhileAnimating={true}
            onBackdropPress={() => setIsVisible(null)}
    >
      {<Chart />}
       
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f5f8fa',
    padding: 16,
    borderRadius: 16,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    height: 40,
  },
  bar: {
    height: 30,
    borderRadius: 10,
    backgroundColor: '#1da1f2',
    marginRight: 8,
  },
  labels: {
    position: 'absolute',
    paddingHorizontal: 20,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    width: '100%',
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: 8,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000000',
    shadowOpacity: 0.1,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#14171a',
    marginRight: 8,
  },
  percentLabel: {
    fontSize: 16,
    color: '#657786',
    alignSelf: 'flex-end',
  },
  footer: {
    fontSize: 16,
    color: '#657786',
    textAlign: 'center',
    marginTop: 16,
  },
});

