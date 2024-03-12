const upload_preset = import.meta.env.VITE_UPLOAD_PRESET; //in vite upload env file is slightly deiffrent
const cloud_name = import.meta.env.VITE_CLOUD_NAME;

const uploadImageToCloudinary = async (file) => {
  const uploadData = new FormData();

  uploadData.append("file", file); //we gave to append image file
  uploadData.append("upload_preset", upload_preset);
  uploadData.append("cloud_name", cloud_name);

  //now send the img data to cloudinary image upload API import   //it sends a post req with the img data in the request body
  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${cloud_name}/image/upload`,
    {
      method: "post",
      body: uploadData,
    }
  );
  //when we recieve a res we purse it as json and return the data
  const data = await res.json();

  return data;
};

export default uploadImageToCloudinary;

//this func take an image file as its parameter
