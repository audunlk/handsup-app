import React, { useEffect, useState } from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import Modal from 'react-native-modal'
import { getAnswersByPollId } from '../services/answerRequests'
import { getUserObject } from '../services/userRequests'
import Loading from '../screens/Loading'
import { UserModal } from './UserModal'

export default function PollResults({ poll, team, isVisible, setIsVisible, hasAnswered }) {
  const [answers, setAnswers] = useState([])
  const [answerOptions, setAnswerOptions] = useState(poll.answers)
  const [users, setUsers] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [countMap, setCountMap] = useState<ICountMap>({})
  const [isAdmin, setIsAdmin] = useState(false)
  const [totalVotes, setTotalVotes] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isUserModalVisible, setIsUserModalVisible] = useState(false);

  interface ICountMap {
    [key: string]: string[]
  }

  useEffect(() => {
    setIsLoading(true)
    getAnswers()
    setIsLoading(false)
  }, [poll, team])

  useEffect(() => {
    fetchUsers();
  }, [answers])
  
  useEffect(() => {
    handleCountVotes();
  }, [users]);

  const getAnswers = async () => {
    try {
      const answers = await getAnswersByPollId(poll.id)
      setAnswers(answers)
      console.log(answers)
      setTotalVotes(answers.length)
    }
    catch (err) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchUsers = async () => {
    setIsLoading(true)
    try {
      const userPromises = answers.map((answer) => getUserObject(answer.userId));
      const users = await Promise.all(userPromises);
      setUsers(users);
      console.log({ users })
      console.log("users")
    } catch (err) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCountVotes = () => {
    const countMap = {};
    answerOptions.forEach(option => {
      countMap[option] = [];
    });
    answers.forEach(answer => {
      const answerIndex = answer.answerIndex;
      const user = users.find(user => user.id === answer.userId);
      if (countMap.hasOwnProperty(answerOptions[answerIndex]) && user) {
        countMap[answerOptions[answerIndex]].push({ username: user.username, firstName: user.firstName});
      }
    });
    console.log(countMap);
    setCountMap(countMap);
  };




  const Chart = () => {
    const handleAnswerPress = (answer) => {
      setSelectedAnswer(answer);
      setIsUserModalVisible(true);
    };
    return (
      <View style={styles.container}>
        <Text style={styles.header}>{poll.question}</Text>
        <Text>You answered: {hasAnswered}</Text>
        {Object.entries(countMap).map(([key, value]) => (
          <TouchableOpacity
            key={key}
            style={styles.item}
            onPress={() => handleAnswerPress(key)}
            disabled={value.length === 0}
          >
            <View style={[styles.bar, { width: (value.length / totalVotes) * 100 + '%' }]} />
            <View style={styles.labels}>
              <Text style={styles.label}>{key}</Text>
              <Text style={[styles.percentLabel]}>{((value.length / totalVotes) * 100).toFixed(1)}%</Text>
            </View>
          </TouchableOpacity>
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
      {isUserModalVisible && (
        <UserModal
          isVisible={isUserModalVisible}
          countMap={countMap}
          selectedAnswer={selectedAnswer}
          onClose={() => setIsUserModalVisible(false)}
        />
      )}
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
    height: 60,
  },
  bar: {
    height: "100%",
    borderRadius: 10,
    marginVertical: 8,
    backgroundColor: '#1da1f2',
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

