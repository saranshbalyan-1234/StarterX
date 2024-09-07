const abortSession = (req) => {
  if (!req.session) return;
  req.session.abortTransaction().then(() => req.session.endSession()).catch((er) => {
    console.error(er);
  });
};

const commitSession = (req) => {
  if (!req.session) return;
  req.session.commitTransaction().then(() => req.session.endSession()).catch((er) => {
    console.error(er);
  });
};

export { abortSession, commitSession };
