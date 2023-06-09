import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#141d26",
    //to account for 120 height bottom bar
    paddingBottom: 120,
  },
  fullContainer: {
    flex: 1,
    backgroundColor: "#141d26",
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
  scrollBody:{
    height: 1000,
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
    borderWidth: 2,
    alignItems: "center",
    width: "100%",
    justifyContent: "center",
  },
  inputError:{
    backgroundColor: "white",
    padding: 10,
    borderRadius: 10,
    marginBottom: 20,
    marginTop: 10,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    borderColor: "red",
    borderWidth: 2,
  },
  serialBox: {
    backgroundColor: "white",
    padding: 10,
    borderRadius: 10,
    margin: 10,
    width: 200,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  largeText: {
    color: "white",
    fontSize: 40,
    fontWeight: "bold",
  },
  mediumText: {
    color: "white",
    fontSize: 20,
  },
  smallText: {
    color: "white",
    fontSize: 15,
  },
  listItem: {
    width: "100%",
    height: 100,
    
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
    backgroundColor: "#FFA500",
    padding: 10,
    borderRadius: 10,
    margin: 10,
    width: 200,
    alignItems: "center",
    alignSelf: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  twoByTwo: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  inputStack:{
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    },
    inputHorizontal:{
        width: "100%",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
  },
inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    backgroundColor: '#fff',
    justifyContent: 'space-between',
},
messageInputContainer: {
    flexDirection: 'row',
    width: '100%',
    backgroundColor: "#141d26",
    justifyContent: 'space-around',
    marginBottom: 10,
    
},
messageInput: {
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 2,
    alignItems: "center",
    width: "80%",
    justifyContent: "center",
    padding: 5,
    marginHorizontal: 10,
},
messageInputButton: {
    padding: 10,
    alignItems: "center",
    width: "15%",
    justifyContent: "center",
    marginHorizontal: 10,
    borderRadius: 10,
},
wrapper: {},
buttonWrapper: {
    flex: 1,
    alignItems: "flex-end",
    flexDirection: "row",
    color: "white",
},
  slide1: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#141d26",
    padding: 20,
  },
  slide2: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#141d26",
    padding: 20,
  },
  slide3: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#141d26",
    padding: 20,
  },
  slide4: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#141d26",
    padding: 20,
  },

});

export default styles;

// #FFA500 : orange
// #FFD700 : gold
// #FFC400 : yellow
