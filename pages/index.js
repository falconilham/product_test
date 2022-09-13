
import { useContext, useState, useMemo } from 'react';
import { Container, Grid, TextField, Button, Paper } from '@mui/material'
import { Delete, Check, Clear } from '@mui/icons-material';
import { Text, Div } from '../component'
import { store } from '../store.js';
import { fetcher } from '../utils/request'
import useSWR from 'swr';

function Home() {
  const { state, dispatch } = useContext(store)
  const [taskName, setTaskName] = useState('')
  const addToStore = () => {
    dispatch({
      type: 'add Task',
      payload: {
        taskName,
        id: state.length,
        status: 'todo'
      }
    })
    setTaskName('')
  }

  // const { data } = useGetApi('/api/hello')
  const { data: result } = useSWR('/api/hello', fetcher)

  const changeTask = (id, status) => dispatch({
    type: 'change task',
    payload: {
      id,
      status
    }
  })

  const removeTask = (id) => dispatch({
    type: 'remove task',
    payload: id
  })

  const taskTodo = useMemo(() => state.filter(({ status }) => status === 'todo'), [state])
  const taskTodoDone = useMemo(() => state.filter(({ status }) => status === 'done'), [state])

  return (
    <Container>
      <Grid padding={1} justifyContent="center" container spacing={2} rowSpacing={2} rowGap={5}>
        <Grid justifyContent="center" alignItems="center" item md={12}>
          <Div justifyContent="center">
            <TextField
              onChange={(e) => setTaskName(e.target.value)}
              value={taskName}
              sx={styles.marginRight}
              label="Add Task"
              variant="outlined"
            />
            <Button onClick={addToStore} variant="contained" size='large'>Add</Button>
          </Div>
        </Grid>
        <Grid container direction="row" spacing={2} >
          <Grid item md={6} sm={6} xs={12}>
            <Text sx={styles.marginBottom}>To Do</Text>
            <Grid container rowGap={2} direction="column">
              {taskTodo.map(({ taskName, id }) => {
                return (
                  <Paper sx={styles.paper} key={id}>
                    <Text>{taskName}</Text>
                    <Div>
                      <Check sx={styles.cursor} color="success" onClick={() => changeTask(id, 'done')} />
                      <Delete sx={styles.cursor} color="error" onClick={() => removeTask(id)} />
                    </Div>
                  </Paper>
                )
              })}
            </Grid>
          </Grid >
          <Grid item md={6} sm={6} xs={12}>
            <Text sx={styles.marginBottom}>To Do Done</Text>
            <Grid container rowGap={2} direction="column">
              {taskTodoDone.map(({ taskName, id }) => {
                return (
                  <Paper sx={styles.paper} key={id}>
                    <Text>{taskName}</Text>
                    <Div>
                      <Clear sx={styles.cursor} color="warning" onClick={() => changeTask(id, 'todo')} />
                    </Div>
                  </Paper>
                )
              })}
            </Grid>
          </Grid >
        </Grid>
      </Grid>
    </Container>
  )
}

const styles = {
  paper: {
    padding: 1,
    justifyContent: 'space-between',
    flexDirection: 'row',
    display: 'flex',
  },
  marginRight: {
    marginRight: 2
  },
  marginBottom: {
    marginBottom: 2
  },
  cursor: {
    cursor: 'pointer'
  },
}

export default Home
