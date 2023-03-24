import React, { useState, useEffect, useContext} from 'react'
import { View, Text, StyleSheet, InteractionManager, TouchableOpacity } from 'react-native'
import Header from '../components/Header'
import { UserContext } from '../navigation/ScreenNav'
import { getGroupsByUser } from '../services/accountSetup'
import { LinearGradient } from 'expo-linear-gradient'
import ListItem from '../components/ListItem'

export default function Groups( {navigation}) {
    const { user } = useContext(UserContext)
    const [groups, setGroups] = useState([])
    const [error, setError] = useState('')

    useEffect(() => {
        console.log(user)
        console.log('user in groups')
        defineGroups()
    }, [])

    const defineGroups = async () => {
     
        try{
        const groups = await getGroupsByUser(user.id)
        console.log(groups)
        setGroups(groups)}
        catch(error) {
            console.log(error)
            setError(error)
        }finally{
        }
    }

    const openInfo = () => {
        console.log('open info')
    }

    const handleRenderGroups = () => {
        return groups.map((group) => {
            return (
                <ListItem
                key={group.id}
                title={group.name}
                onPress={() => navigation.navigate('GroupInfo', {group: group})}
                />
            )
        })
    }

    const handleCreateTeam = () => {
        navigation.navigate('CreateTeam')
      }
      const handleJoinTeam = () => {
        navigation.navigate('JoinTeam', {user: user})
      }

  return (
    <View style={styles.container}>
        <LinearGradient
        colors={["#3c41cf", "#1d9afd"]}
        style={styles.linearGradient}
      >
        <Header navigation={navigation} title={'Groups'} showExit={true}/>
        <View style={styles.headerBtn}>
              <>
                <TouchableOpacity onPress={
                  handleJoinTeam
                } style={styles.btn}>
                  <Text style={{color: 'white', fontSize: 20}}>Join a Team</Text>
                </TouchableOpacity>
                
                 <TouchableOpacity onPress={
                  handleCreateTeam
                } style={styles.btn}
                >
                  <Text style={{color: 'white', fontSize: 20}}>Create a Team</Text>
                </TouchableOpacity>
              </>
          </View>
        <View style={styles.body}>
            {handleRenderGroups()}
        </View>
        </LinearGradient>
    </View>
  )
}



const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    linearGradient: {
      flex: 1,
      paddingLeft: 15,
      paddingRight: 15,
      borderRadius: 5,
    },
    headerBtn: {
        justifyContent: "space-between",
        paddingHorizontal: 20,
        flexDirection: "row",
        alignItems: "center",
    },
    btn: {
        backgroundColor: "#1d9afd",
        padding: 10,
        alignItems: "center",
        justifyContent: "center",
        marginVertical: 10,
        width: 150,
      },
    body: {
        marginTop: 20,
      flex: 1,
      color: "white",
      alignItems: "center",
      flexDirection: "column",
    },
    input: {
      height: 40,
      margin: 12,
      borderWidth: 1,
      borderColor: "white",
      backgroundColor: "white",
      padding: 10,
      width: 300,
      borderRadius: 5,
    },
    inputText: {
      fontSize: 12,
      color: "white",
    },
   
  });
