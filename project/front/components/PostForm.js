import { TrashIcon } from "@heroicons/react/20/solid";
import { PhotoIcon } from "@heroicons/react/24/outline";
import React, { useCallback, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { genPost } from "../db";
import useInput from "../hooks/useInput";
import { ADD_POST_REQUEST } from "../reducers/post";

const PostForm = () => {
  const dispatch = useDispatch();
  const { me } = useSelector((state) => state.user);
  const { addPostDone, imagePaths } = useSelector((state) => state.post);

  const [text, onChangeText, setText] = useInput("");

  useEffect(() => {
    if (addPostDone) {
      setText("");
    }
  }, [addPostDone]);

  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm();

  const onUploadPost = (formData) => {
    if (!topic) {
      formData.topic = "주제 없음";
    }
    const { topic, content } = formData;
    console.log(topic, content);
    // return dispatch({
    //   type: ADD_POST_REQUEST,
    //   data: { topic, content },
    // });
  };

  const imageInput = useRef();
  const onClickImageUpload = useCallback(() => {
    imageInput.current.click();
  }, [imageInput.current]);
  const onChangeImages = useCallback(() => {}, []);

  return (
    <div className="flex  rounded mb-10">
      <div className="flex relative flex-col w-full ">
        <form
          onSubmit={handleSubmit(onUploadPost)}
          encType="multipart/form-data"
          className="mb-8 w-full relative "
        >
          <div className="py-2 px-4 mb-2 bg-white w-full shadow-md rounded  ">
            <label
              htmlFor="topic"
              className="block text-sm font-medium text-slate-700"
            ></label>
            <input
              id="topic"
              type="text"
              placeholder="토픽 설정"
              className="my-1  py-1.5 block w-1/3 placeholder:text-slate-300 text-sm rounded border-slate-300  focus:border-indigo-500 focus:ring-indigo-500 "
              {...register("topic")}
            />
            <label htmlFor="content" className="sr-only"></label>
            <textarea
              id="content"
              maxLength={800}
              rows="3"
              className="px-0 pt-2 w-full text-sm  border-0 focus:ring-0 focus:outline-none placeholder:text-slate-300"
              placeholder="우측 아래를 드래그하여 입력창을 넓힐 수 있습니다."
              {...register("content", {
                required: "내용을 입력해주세요",
                maxLength: {
                  value: 800,
                  message: "800자 이내로 입력해주세요",
                },
              })}
            ></textarea>
            <div className="mt-2 border-t border-slate-200  py-2 w-full">
              <div className="mt-1 flex justify-between w-2/3">
                <button
                  type="button"
                  onClick={null}
                  className="w-2/12 lg:w-1/12 sm:w-2/12 mx-0.5 relative rounded overflow-hidden  "
                >
                  <img
                    className="hover:opacity-25 z-0 aspect-square object-cover"
                    src="https://i.guim.co.uk/img/media/c5e73ed8e8325d7e79babf8f1ebbd9adc0d95409/2_5_1754_1053/master/1754.jpg?width=1200&height=900&quality=85&auto=format&fit=crop&s=d41b50ebb44dd5d055f57f30b97708ab"
                  />
                  <div className="z-1 flex justify-center items-center w-full h-full top-0 left-0 absolute opacity-0 hover:bg-white hover:opacity-100 hover:bg-opacity-50">
                    <TrashIcon className="text-slate-700 w-1/3 h-1/3 " />
                  </div>
                </button>
              </div>
            </div>
          </div>

          <div className="absolute flex items-center right-0">
            <input
              type="file"
              name="image"
              multiple
              hidden
              ref={imageInput}
              onChange={onChangeImages}
            />
            <button
              type="button"
              onClick={onClickImageUpload}
              className="py-1 px-1 text-xs font-medium text-center bg-white shadow-md text-slate-700 rounded focus:ring-4 focus:ring-slate-200  hover:bg-slate-50"
            >
              <PhotoIcon className="stroke-2 block h-5 w-5  cursor-pointer" />
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="ml-1.5 py-1.5 px-4 text-xs font-medium text-center shadow-md bg-indigo-500 rounded text-white hover:bg-indigo-600"
            >
              Flash
            </button>
          </div>
        </form>
        <div
          className="absolute bottom-2 left-1.5 flex text-orange-500 text-xs "
          role="alert"
        >
          {errors.content ? <>{errors.content.message}</> : ""}
        </div>
      </div>
    </div>
  );
};

export default PostForm;
