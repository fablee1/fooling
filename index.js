const eraseEverything = async () => {
  let username = "mikelitoris34@icloud.com";
  let password = "bollocks69";
  let response = await fetch(
    `https://striveschool-api.herokuapp.com/api/account/login?username=${username}&password=${password}`,
    {
      method: "POST",
    }
  );
  let key = await response.json();
  const apiKey = `Bearer ${key.access_token}`;
  //   console.log(apiKey);

  const array = await fetch(
    `https://striveschool-api.herokuapp.com/api/comments/`,
    {
      method: "GET",
      headers: {
        Authorization: apiKey,
        "Content-type": "application/json",
      },
    }
  )
    .then((res) => res.json())
    .then(async (data) => {
      if (data.length === 0) {
        console.log(`There's no comments to erase`);
      } else {
        Console.log(`Initiating wiping of the database`);
        for (let i = 0; i < data.length; i++) {
          await fetch(
            `https://striveschool-api.herokuapp.com/api/comments/${data[i]._id}`,
            {
              method: "DELETE",
              headers: {
                Authorization: apiKey,
              },
            }
          );
          console.log(
            `Operation №${i}: The comment with ID: ${data[i]._id} has been deleted`
          );
        }
        console.log(`There's no comments left`);
      }
    });
};
