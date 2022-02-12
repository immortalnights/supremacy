import Universe from "./data.js"

const simulate = () => {
  setInterval(() => console.log("tick"), 1000)
}

onmessage = (e) => {
  const u = new Universe()
  console.log("received")
}

export default simulate
