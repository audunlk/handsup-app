import React, { useState, useEffect } from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { Poll } from '../redux/types/types';
import styles from '../styles/styles';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../redux/types/types';
import { renderPolls } from '../utils/renderPolls';
import { FlatList } from 'react-native-gesture-handler';
import BottomNav from '../navigation/BottomNav';
import { getPollsByTeamSerials } from '../services/pollRequests';
import { getTeamsByUserId } from '../services/teamRequests';
import { setPolls } from '../redux/slices/pollSlice';
import { User } from '../redux/types/types';
import { Ionicons } from '@expo/vector-icons';
import Header from '../components/Header';



export default function Polls({ navigation }) {
    const user: User = useSelector((state: RootState) => state.user);
    const polls = useSelector((state: RootState) => state.polls);
    const reRender = useSelector((state: RootState) => state.reRender);
    const dispatch = useDispatch();
    const [error, setError] = useState("");
    const [teams, setTeams] = useState([]);
    const [selectedTab, setSelectedTab] = useState("active");
    const [isContentLoaded, setIsContentLoaded] = useState(false);

    const getPolls = async () => {
        try {
            const polls = await getPollsByTeamSerials(teams.map(team => team.serialKey));
            dispatch(setPolls(polls));
            setIsContentLoaded(true);
        } catch (error) {
            console.log(error);
            setError(error);
        }
    };

    const getTeams = async () => {
        try {
            const teams = await getTeamsByUserId(user.id);
            setTeams(teams);
        } catch (error) {
            console.log(error);
            setError(error);
        }
    }

    useEffect(() => {
        getTeams();
        getPolls();
        console.log(reRender)
    }, [dispatch, user, navigation, isContentLoaded, reRender]);


    const now = new Date();
    const activePolls = polls
        .filter((poll) => new Date(poll.respond_by) > now)
        .sort((a, b) => new Date(a.respond_by).getTime() - new Date(b.respond_by).getTime());

    const expiredPolls = polls
        .filter((poll) => new Date(poll.respond_by) <= now)
        .sort((a, b) => new Date(a.respond_by).getTime() - new Date(b.respond_by).getTime());


    return (
        <View style={styles.container}>
            <Header navigation={navigation} title={"Polls"} showExit={false} />
                <View style={styles.tabs}>
                    <TouchableOpacity onPress={() => setSelectedTab("active")}>
                        <Text style={{ color: "white" }}>Active</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setSelectedTab("expired")}>
                        <Text style={{ color: "white" }}>Expired</Text>
                    </TouchableOpacity>
                </View>
                <FlatList
                    data={selectedTab === "active" ? renderPolls(activePolls, navigation, teams) : renderPolls(expiredPolls, navigation, teams)}
                    renderItem={({ item }) => item}
                    keyExtractor={(item, index) => index.toString()}
                />
            <BottomNav navigation={navigation} />
        </View>
    )
}
