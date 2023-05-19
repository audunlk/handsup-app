import React, { useState, useEffect } from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { Poll } from '../redux/types/types';
import styles from '../styles/styles';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../redux/types/types';
import { renderPolls } from '../utils/renderPolls';
import { FlatList } from 'react-native-gesture-handler';
import BottomNav from '../navigation/BottomNav';
import { getTeamsByUserId } from '../services/teamRequests';
import { User } from '../redux/types/types';
import Header from '../components/Header';

export default function Polls({ navigation }) {
    const user: User = useSelector((state: RootState) => state.user);
    const polls: Poll[] = useSelector((state: RootState) => state.polls);
    const reRender = useSelector((state: RootState) => state.reRender);
    const dispatch = useDispatch();
    const [error, setError] = useState("");
    const [teams, setTeams] = useState([]);
    const [selectedTab, setSelectedTab] = useState("active");
    const [isContentLoaded, setIsContentLoaded] = useState(false);

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
                <View style={[styles.tabs, {marginBottom: 20}]}>
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
