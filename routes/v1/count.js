const handler = async (req, res) => {
  //TODO get the user from the session token??
  switch (req.method) {
    case "GET":
      return getHandler(req, res);
    case "PUT":
      return res.status(405).json({
        error: "Invalid request"
      });
    case "DELETE":
      return res.status(405).json({
        error: "Invalid request"
      });
    case "POST":
      return res.status(405).json({
        error: "Invalid request"
      });
  }
};

// ENDPOINT HANDLER
const getHandler = async (req, res) => {

  if(!req.query){
    return res.status(400).json({
      error: "Invalid query provided"
    });
  }

  if(!req.query.endpoint || !req.query.type){
    return res.status(400).json({
      error: "Invalid query provided"
    });
  }

  if(!endPointChecker(req.query.endpoint)){
    return res.status(400).json({
      error: "Invalid endpoint specified"
    });
  }

  if(!requestChecker(req.query.type)){
    return res.status(400).json({
      error: "Invalid request type specified"
    });
  }

  console.log(req.app.locals);

  return res.status(200).json({
    success: true,
    count: req.app.locals[formatEndpoint(req.query.endpoint)][formatRequestType(req.query.type)]
  });
};

// Helper function, checks if an endpoint is courses or users
// This does not check if endpoint is undefined or null
const endPointChecker = (endpoint) => {
  const formatted_endpoint = endpoint.toUpperCase();
  const supportedEndPoints = ["COURSES", "USERS", "FAVORITES"];
  return supportedEndPoints.includes(formatted_endpoint);
}

// Helper function, checks if a request is valid
// This does not check if request is undefined or null
const requestChecker = (requestType) => {
  const supportedRequestTypes = ["GET", "POST", "PUT", "DELETE"];
  const formatted_requestType = requestType.toUpperCase();
  return supportedRequestTypes.includes(formatted_requestType);
}

// Helper function, converts an request type to the server supported version
// i.e. GET -> getCount

const formatRequestType = (requestType) => {
  let formatted_requestType = requestType.toLowerCase();
  return formatted_requestType + "Count";
}

const formatEndpoint = (endpoint) => {
  let formatted_endpoint = endpoint.toLowerCase();
  return formatted_endpoint;
}


module.exports = handler;
