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
  useState
} from "react";

import { Ionicons } from '@expo/vector-icons';
import uuid from 'react-native-uuid';
import Header from '../components/Header';

interface TaskData {
  id: string,
  desc: string,
  status: boolean,
}

export default function App() {

  const [todoList, setTodoList] = useState<TaskData[]>(
    [
      { id: String(uuid.v4()), desc: "Do quiz1", status: false },
      { id: String(uuid.v4()), desc: "Do lab1", status: false },
    ]
  )
  const [todoDesc, setTodoDesc] = useState('')
  const [todoStatus, setTodoStatus] = useState(false)
  const [disabledAddButton, setDisabledAddButton] = useState(true)

  const addTask = async () => {
    console.log("* add item : " + todoDesc)

    if (todoDesc == "") {
      console.log("is blank")
      alert("Please input description for Todo.")
      return
    }

    var duplicateFlag: Boolean = false

    todoList.map((t) => {
      if (t.desc == todoDesc) { duplicateFlag = true; return; }
    })

    if (duplicateFlag) {
      alert("Description is duplicated.")
      return
    }

    const newTodoList = [...todoList]
    newTodoList.push({ id: String(uuid.v4()), desc: todoDesc, status: todoStatus })
    setTodoList(newTodoList)
  }

  const onChangeTextDesc = async (desc: any) => {
    setDisabledAddButton(!!(desc == ""))
    setTodoDesc(desc)
  }

  const renderTask = ({ item }: any) => {

    const deleteItem = async () => {
      console.log("* delete item: " + item.id)
      const newTodoList: TaskData[] = [];
      todoList.filter(t => t.id != item.id).map((t) => { newTodoList.push(t) })
      setTodoList(newTodoList)
    }

    const changeStatus = async () => {
      console.log("* change status: " + item.id)
      const newTodoList: TaskData[] = [];
      todoList.map((t) => { if (t.id == item.id) { t.status = !t.status } newTodoList.push(t) })
      setTodoList(newTodoList)
    }

    return (
      <View style={styles.taskContainer}>
        <Text style={styles.taskId}>{item.id} </Text>
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
