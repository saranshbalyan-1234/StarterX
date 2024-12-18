const abortSession = (req) => {
  if (!req.mongosession) return;
  req.mongosession.abortTransaction().then(() => req.mongosession.endSession()).catch((er) => {
    console.error(er);
  });
};

const commitSession = (req) => {
  if (!req.mongosession) return;
  req.mongosession.commitTransaction().then(() => req.mongosession.endSession()).catch((er) => {
    console.error(er);
  });
};

export { abortSession, commitSession };
