import React, { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import Button from "../../global/Button";
import DeleteProfile from "./DeleteProfile";
import Select from "react-select";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../../firebase.js";
import {
  updateUserSuccess,
  updateUserFailure,
  updateUserStart,
} from "../../redux/user/userSlice.js";
import { InfinitySpin } from "react-loader-spinner";
import { Link } from "react-router-dom";

const SeekerProfile = () => {
  const fileRef = useRef(null);
  const dispatch = useDispatch();
  const publiccategories = useSelector(
    (state) => state.publiccategories.publiccategories
  );
  const { currentUser, error, loading } = useSelector((state) => state.user);
  const [file, setFile] = useState(undefined);
  const [filePerc, setFilePerc] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [formData, setFormData] = useState({
    name: currentUser.fullname,
  });
  const [updateSuccess, setUpdateSuccess] = useState(false);

  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);

  const handleFileUpload = (file) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setFilePerc(Math.round(progress));
      },
      (error) => {
        setFileUploadError(true);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) =>
          setFormData((prevFormData) => ({
            ...prevFormData,
            avatar: downloadURL,
          }))
        );
      }
    );
  };

  const handleChange = (e, meta) => {
    if (e && e.target) {
      const { id, value } = e.target;
      setFormData({
        ...formData,
        [id]: value,
      });
    } else if (meta && meta.name) {
      setFormData({
        ...formData,
        [meta.name]: e.value,
      });
      setSelectedOption(e);
    }
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart());
      const res = await fetch(`/api/auth/update/${currentUser._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(updateUserFailure(data.message));
        return;
      }
      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);
    } catch (error) {
      dispatch(updateUserFailure(error.message));
    }
  };

  const handleDelete = DeleteProfile();
  const handleClickToDelete = async () => {
    await handleDelete();
  };

  useEffect(() => {
    const selectedCategory = publiccategories.find(
      (category) => category.categoryname === currentUser.pjobcategory
    );
    setSelectedOption(
      selectedCategory
        ? {
            label: selectedCategory.categoryname,
            value: selectedCategory.categoryname,
          }
        : null
    );
  }, [publiccategories, currentUser]);

  return (
    <div className="max-w-4xl m-auto">
      <h1 className="text-[1.5rem] font-poppins font-bold text-[#1C64F2] my-2">
        {currentUser.name.split(" ")[0]}'s Profile
      </h1>
      <form onSubmit={handleUpdateSubmit}>
        <input
          type="file"
          onChange={(e) => {
            setFile(e.target.files[0]);
          }}
          ref={fileRef}
          accept="image/*"
          hidden
        />
        <img
          onClick={() => {
            fileRef.current.click();
          }}
          src={formData.avatar || currentUser.avatar}
          alt="profile pic"
          className="h-24 w-24 rounded-[999px] m-auto cursor-pointer"
        />
        <p className="text-sm m-2 font-poppins">
          {fileUploadError ? (
            <span className="text-[#FF0000]">
              Error (Image Must be Less Than 2 Mega Byte)
            </span>
          ) : filePerc > 0 && filePerc < 100 ? (
            <span className="text-[gray]">{`Uploading ${filePerc} %`}</span>
          ) : filePerc === 100 ? (
            <span className="text-[green]">Image Successfully Uploaded!</span>
          ) : (
            ""
          )}
        </p>
        <div className="sm:grid sm:grid-cols-2 sm:gap-6  p-3 flex flex-col gap-2">
          <div className="mb-4">
            <label
              htmlFor="name"
              className="flex justify-start font-poppins text-[#000]    mb-1"
            >
              Full Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              className={`w-full p-2 border border-[#D6D6D6] rounded-[0.625rem] font-poppins text-[#AEB0B4] text-[0.8rem] `}
              placeholder="Name"
              defaultValue={currentUser.name}
              onChange={(e) => handleChange(e)}
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="jobCategory"
              className="flex justify-start font-poppins text-[#000] mb-1"
            >
              Preferred Job Category
            </label>
            <Select
              value={selectedOption}
              onChange={(e) => handleChange(e, { name: "pjobcategory" })}
              options={publiccategories.map((category) => ({
                label: category.categoryname,
                value: category.categoryname,
              }))}
              isSearchable
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="email"
              className="flex justify-start font-poppins text-[#000]    mb-1"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className={`w-full p-2 border border-[#D6D6D6] rounded-[0.625rem] font-poppins text-[#AEB0B4] text-[0.8rem] `}
              placeholder="Email"
              defaultValue={currentUser.email}
              onChange={(e) => handleChange(e)}
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="phone"
              className="flex justify-start font-poppins text-[#000]    mb-1"
            >
              Mobile No
            </label>
            <input
              type="text"
              id="phone"
              name="phone"
              className={`w-full p-2 border border-[#D6D6D6] rounded-[0.625rem] font-poppins text-[#AEB0B4] text-[0.8rem] `}
              placeholder="Phone"
              defaultValue={currentUser.phone}
              onChange={(e) => handleChange(e)}
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="password"
              className="flex justify-start font-poppins text-[#000]    mb-1"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              className={`w-full p-2 border border-[#D6D6D6] rounded-[0.625rem] font-poppins text-[#AEB0B4] text-[0.8rem] `}
              placeholder="password"
              onChange={(e) => handleChange(e)}
            />
          </div>

        </div>
        <div className="flex flex-row justify-center items-center">
          {loading ? (
            <InfinitySpin
              className="items-center"
              width={100}
              height={100}
              color="black"
            />
          ) : (
            <Button msg="Update" border="rounded-button" />
          )}
        </div>
        <p className="text-[red] font-poppins">{error ? error : ""}</p>
        {updateSuccess && (
          <p className="text-[green] font-poppins my-3 text-start">
            Profile Updated Successfully!
          </p>
        )}
        <div className=" bg-[gray] h-1  my-2" />
        <div className="flex flex-row justify-center gap-12 items-center mt-2 mb-2">
          <span
            onClick={handleClickToDelete}
            className="font-poppins text-[#B91C1C] cursor-pointer  "
          >
            Delete Account
          </span>
          <Link to={`/appliedjobs`} className="cursor-pointer">
            <span className="font-poppins text-[#22C55E]  ">Applied Jobs</span>
          </Link>
        </div>
      </form>
    </div>
  );
};

export default SeekerProfile;
