function Dashboard({ auth }) {
  return <h2>Hoş geldin {auth?.username}</h2>;
}

export default Dashboard;