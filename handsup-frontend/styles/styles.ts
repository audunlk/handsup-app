import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#141d26",
    //to account for 120 height bottom bar
    paddingBottom: 120,
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
    width: "100%",
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
    fontSize: 15,
    marginLeft: 10,
  },
  smallText: {
    color: "white",
    fontSize: 10,
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
    backgroundColor: "#19202b",
    padding: 10,
    borderRadius: 10,
    margin: 10,
    width: 200,
    alignItems: "center",
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
    
  }
});

export default styles;
