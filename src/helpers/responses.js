
export const SuccessResponse = (res, { data } = {}) => {
  return res.status(200).json({
    status: "Ok",
    data: data ?? undefined
  });
};