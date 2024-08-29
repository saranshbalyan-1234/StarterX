const autoIncrementV = function autoIncrementV (schema) {
  // Version update
  schema.pre(/updateOne|updateMany|findOneAndUpdate/, function pre (next) {
    this.options.runValidators = true; // trigger validation on update
    this.options.context = 'query'; // trigger validation on upsert

    const isTimeStampUpdate = this.getUpdate().$set?.updatedAt;
    const isUpsert = this.getUpdate().$setOnInsert?.hasOwnProperty('__v');
    const isVersionModified = this.getUpdate().$set?.__v;

    if (!isTimeStampUpdate || isUpsert || isVersionModified) return next();
    try {
      this.getUpdate().$inc = { ...(this.getUpdate().$inc || {}), __v: 1 };
      next();
    } catch (error) {
      console.log('Error in global preupdate hook', error);
      return next(error);
    }
  });
};

export default autoIncrementV;
