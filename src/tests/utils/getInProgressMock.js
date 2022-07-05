const getInProgressMock = (type, mockCase, id) => {
  if (mockCase === '1') return null;

  let inProgressMock;
  switch (mockCase) {
  case '2':
    inProgressMock = {};
    break;
  case '3':
    inProgressMock = { [type]: {} };
    break;
  case '4':
    inProgressMock = { [type]: { [id]: [] } };
    break;
  default:
    break;
  }

  return JSON.stringify(inProgressMock);
};

module.exports = getInProgressMock;
