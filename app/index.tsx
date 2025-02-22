import {
  FlatList,
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";

import {
  useEffect,
  useState
} from "react";

import { Ionicons } from '@expo/vector-icons';
import Header from '../components/Header';
import * as database from '../database';

interface TaskData {
  id: string,
  desc: string,
  status: boolean,
}

export default function App() {

  const [todoList, setTodoList] = useState<TaskData[]>([])
  const [todoDesc, setTodoDesc] = useState('')
  const [todoStatus, setTodoStatus] = useState(false)
  const [disabledAddButton, setDisabledAddButton] = useState(true)

  // reload all data from firestore
  useEffect(() => {
    const fetchData = async () => {
      setTodoList(await database.readAll());
    }
    fetchData();
  }, []);

  const addTask = async () => {

    if (todoDesc == "") {
      console.log("is blank")
      alert("Please input description for Todo.")
      return
    }

    // check duplication
    var duplicateFlag: Boolean = false
    todoList.map((t) => {
      if (t.desc == todoDesc) { duplicateFlag = true; return; }
    })

    if (duplicateFlag) {
      alert("Description is duplicated.")
      return
    }

    console.log("* add item : " + todoDesc)

    // insert data into firestore
    await database.insert({ desc: todoDesc, status: todoStatus })

    // reload all data from firestore
    setTodoList(await database.readAll());
  }

  const onChangeTextDesc = async (desc: any) => {
    setDisabledAddButton(!!(desc == ""))
    setTodoDesc(desc)
  }

  const renderTask = ({ item }: any) => {

    const deleteItem = async () => {
      console.log("* delete item: " + item.id)
      // remove data from firestore
      await database.remove(item.id)
      setTodoList(await database.readAll());
    }

    const changeStatus = async () => {
      console.log("* change status: " + item.id)
      // update data in firestore
      await database.update(item.id, { desc: item.desc, status: !item.status })
      setTodoList(await database.readAll());
    }

    return (
      <View style={styles.taskContainer}>
        <Text style={styles.taskId}>ID: {item.id} </Text>
        <Text style={item.status ? styles.taskDescDone : styles.taskDesc}>{item.desc}</Text>
        <View style={styles.taskFunctionContainer}>
          <TouchableOpacity onPress={deleteItem}>
            <Ionicons name='trash-bin-outline' size={30} color="#de5050" />
          </TouchableOpacity>
          <Switch style={styles.taskSwitch} value={item.status} onValueChange={changeStatus} />
          <Text style={styles.taskStatus}>{item.status ? "Done" : "Due"} </Text>
        </View>
      </View>
    )
  }

  return (
    <SafeAreaView style={styles.container}>

      <Header title="Todo List" />

      <View style={styles.taskInputContainer}>

        <TextInput
          style={styles.taskInput}
          placeholder="Enter the task's description"
          onChangeText={desc => onChangeTextDesc(desc)}
        />

        <Switch style={styles.taskInputSwitch} value={todoStatus} onValueChange={status => setTodoStatus(status)} />
      </View>

      <TouchableOpacity
        style={disabledAddButton ? styles.addTaskButtonDisabled : styles.addTaskButton}
        onPress={addTask}
        disabled={disabledAddButton}>
        <Text style={styles.buttonText}>Add Task</Text>
      </TouchableOpacity>


      <FlatList style={styles.todoListContainer}
        data={todoList}
        renderItem={renderTask}
        keyExtractor={(todoList) => todoList.id} />

    </SafeAreaView >
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: "#CFCFCF",
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0
  },
  todoListContainer: {
    width: "100%"
  },
  taskContainer: {
    borderBlockColor: "#CFCFCF",
    borderTopWidth: 1,
    borderBottomWidth: 4,
    borderLeftWidth: 0.2,
    borderRightWidth: 2,
    padding: 10,
    marginLeft: 10,
    marginRight: 10,
    marginTop: 10,
  },
  taskInputContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    minHeight: 40,
    maxHeight: 40,
  },
  taskInputSwitch: {
    marginLeft: 10
  },
  taskInput: {
    borderWidth: 1,
    borderColor: "#CFCFCF",
    width: "80%",
    height: 30,
  },
  addTaskButton: {
    backgroundColor: '#752cb0',
    paddingLeft: 10,
    paddingRight: 10,
    borderRadius: 5,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center'
  },
  addTaskButtonDisabled: {
    backgroundColor: '#CFCFCF',
    paddingLeft: 10,
    paddingRight: 10,
    borderRadius: 5,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center'
  },
  buttonText: {
    color: '#FFF',
    fontSize: 18
  },
  taskId: {
    fontSize: 10,
    color: "gray"
  },
  taskDesc: {
    fontSize: 20,
    margin: 10,
  },
  taskDescDone: {
    fontSize: 20,
    margin: 10,
    textDecorationLine: "line-through"
  },
  taskStatus: {
    margin: 10,
    fontSize: 12
  },
  taskSwitch: {
    marginLeft: 20,
    marginRight: 20,
    fontSize: 12
  },
  taskFunctionContainer: {
    flex: 1,
    flexDirection: "row-reverse",
    maxHeight: 40,
    minHeight: 40,
  }
});
