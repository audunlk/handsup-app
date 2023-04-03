import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#141d26'
      },
      header: {
        justifyContent: "space-between",
        paddingHorizontal: 20,
        marginTop: 80,
        color: "white",
        flexDirection: "row",
      },
      title: {
        color: "white",
        fontSize: 30,
        fontWeight: "bold",
      },
      tabs: {
        justifyContent: "space-between",
        paddingHorizontal: 20,
        marginTop: 20,
        color: "white",
        flexDirection: "row",
        width: "100%",
      },
      body: {
        flex: 1,
        color: "white",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
      },
      listContainer: {
        flex: 1,
        width: "100%",
        marginTop: 20,
        color: "white",
        alignItems: "center",
        flexDirection: "column",
      },
      input: {
        backgroundColor: "white",
        padding: 10,
        borderRadius: 10,
        marginBottom: 20,
        marginTop: 10,
        width: '80%',
        alignItems: "center",
        justifyContent: "center",
      },
      serialBox: {
        backgroundColor: "white",
        padding: 10,
        borderRadius: 10,
        margin: 10,
        width: 200,
        alignItems: "center",
        justifyContent: "center",
        
      },
        mediumText: {
            color: "white",
            fontSize: 20,
            marginLeft: 10,
        },
        smallText: {
            color: "white",
            fontSize: 10,
            marginLeft: 10,
        },

      listItem: {
        width: "100%",
        height: 100,
        borderColor: "white",
        borderBottomWidth: 0.3,
        padding: 10,
        flexDirection: "row",
        alignItems: "center",
        color: "white",
        },
        listTitle: {
            color: "white",
            fontSize: 20,
            fontWeight: "bold",
            marginLeft: 10,
        },
        listDescription: {
            color: "white",
            fontSize: 15,
            marginLeft: 10,
        },
      btn: {
        backgroundColor: "#1d9afd",
        padding: 10,
        borderRadius: 10,
        margin: 10,
        width: 200,
        alignItems: "center",
        justifyContent: "center",
      },
});

export default styles;
