
// messages for inter-process communication inside the Node cluster
const Message = {
  Type: {
    Log: 1
  }
};

// worker interval (how often should it start jobs)
const Worker = {
  Interval: {
    Small: 3,
    Medium: 5,
    Large: 7
  }
};


module.exports = {
  Message,
  Worker
};
