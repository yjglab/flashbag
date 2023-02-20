import { TrashIcon, XMarkIcon } from "@heroicons/react/20/solid";
import React, { useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { backUrl } from "../config/config";
import { ArrowUpCircleIcon, PhotoIcon } from "@heroicons/react/24/outline";
import PropTypes from "prop-types";
import {
  editPost,
  uploadPost,
  loadPrevPostImages,
  cancelPostImage,
  uploadPostImages,
} from "../reducers/postSlice";
import { openNotice } from "../reducers/globalSlice";
import { addPostToMe } from "../reducers/userSlice";

const PostForm = ({
  onTogglePostForm,
  onTogglePostEditMode,
  post,
  postEditMode,
  prevTopic,
  prevContent,
  prevPostImages,
}) => {
  const dispatch = useDispatch();
  const { me } = useSelector((state) => state.user);
  const { postImagePaths, uploadPostImagesError } = useSelector(
    (state) => state.post
  );

  const {
    register,
    reset,
    handleSubmit,
    watch,
    setError,
    setValue,
    formState: { isSubmitting, errors },
  } = useForm({
    mode: "onSubmit",
    defaultValues: {
      topic: "",
      content: "",
    },
  });

  const onUploadPost = (formData) => {
    const { topic, content } = formData;
    if (!content.trim()) {
      return setError("content", {
        message: "빈 포스트를 업로드할 수 없습니다",
      });
    }
    reset();
    onTogglePostForm(false);

    dispatch(uploadPost({ topic, content, postImagePaths }));
  };

  const onEditPost = (editedFormData) => {
    const { topic, content } = editedFormData;

    if (!content.trim()) {
      return setError("content", {
        message: "빈 포스트를 업로드할 수 없습니다",
      });
    }
    reset();
    onTogglePostEditMode(false);
    dispatch(editPost({ PostId: post.id, topic, content, postImagePaths }));
    dispatch(
      openNotice({
        title: "Post edited",
        content: "포스트가 수정되었습니다.",
      })
    );
  };

  const onLoadPrevPostImages = useCallback(() => {
    dispatch(loadPrevPostImages(prevPostImages.map((v) => v.src)));
  });

  useEffect(() => {
    if (postEditMode) {
      onLoadPrevPostImages();
      setValue("topic", prevTopic ? prevTopic : "");
      setValue("content", prevContent);
    }
  }, []);

  const onCancelPostImage = useCallback((i) => () => {
    dispatch(cancelPostImage(i));
  });

  const onChangePostImages = () => {
    const postImages = watch("image");
    const postImagesFormData = new FormData();
    [].forEach.call(postImages, (file) => {
      postImagesFormData.append("postImages", file);
    });

    dispatch(uploadPostImages(postImagesFormData));
  };

  return (
    <div className="fixed inset-0 bg-slate-900 bg-opacity-25 flex justify-center items-center  backdrop-blur-md  z-30">
      <div className="flex md:w-2/3 sm:w-4/5  w-11/12 rounded-md mb-10 relative top-8">
        <div className="flex relative flex-col w-full ">
          <form
            onSubmit={
              postEditMode
                ? handleSubmit(onEditPost)
                : handleSubmit(onUploadPost)
            }
            encType="multipart/form-data"
            className="mb-8 w-full relative "
          >
            <div className="pt-4 pb-4 px-4 mb-2  bg-white w-full shadow-xl rounded-md   ">
              <label
                htmlFor="topic"
                className="block text-sm font-medium text-slate-600"
              ></label>
              <input
                id="topic"
                type="text"
                placeholder="토픽 설정"
                className="my-1 px-1.5 py-1.5 block w-full placeholder:text-slate-300 text-sm rounded-md border-slate-300  focus:border-indigo-500 focus:ring-indigo-500 "
                {...register("topic", {
                  maxLength: {
                    value: 30,
                    message: "토픽은 30자 이내로 제한됩니다.",
                  },
                })}
              />
              <label htmlFor="content" className="sr-only"></label>
              <textarea
                id="content"
                maxLength={1500}
                rows="14"
                className="px-1.5 pt-2 w-full text-sm xl:text-base  border-0 focus:ring-0 focus:outline-none placeholder:text-slate-300"
                placeholder="우측 아래를 드래그하여 입력창을 넓힐 수 있습니다."
                {...register("content", {
                  required: "내용을 입력해주세요",
                  maxLength: {
                    value: 1500,
                    message: "1000자 이내로 입력해주세요",
                  },
                })}
              ></textarea>
              <div className="mt-2 border-t border-slate-200  py-2 w-full">
                <div className="mt-1 flex w-full">
                  {postImagePaths.map((v, i) => (
                    <button
                      type="button"
                      key={v}
                      onClick={onCancelPostImage(i)}
                      className="border border-slate-300 w-2/12 aspect-square lg:w-1/12 sm:w-2/12 mx-0.5 relative rounded-md overflow-hidden  "
                    >
                      {
                        <img
                          className="hover:opacity-25 z-0 aspect-square object-cover"
                          src={
                            process.env.NODE_ENV === "production"
                              ? ``
                              : `${backUrl}/${v}`
                          }
                          alt={v}
                        />
                      }
                      {/* <Image
                      className="hover:opacity-25 z-0 aspect-square object-cover"
                      layout="fill"
                      src={
                        process.env.NODE_ENV === "production"
                          ? ``
                          : `${backUrl}/${v}`
                      }
                      alt={v}
                    /> */}
                      <div className="z-1 flex justify-center items-center w-full h-full top-0 left-0 absolute opacity-0 hover:bg-slate-200 hover:opacity-100 hover:bg-opacity-50">
                        <TrashIcon className="text-slate-600 w-1/3 h-1/3 " />
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="gap-1.5 absolute flex items-center right-0">
              <button
                type="button"
                disabled={isSubmitting}
                className="text-center "
              >
                <XMarkIcon
                  onClick={
                    postEditMode ? onTogglePostEditMode : onTogglePostForm
                  }
                  className="w-9 p-0.5 text-slate-600 shadow bg-white rounded-full hover:bg-slate-700 hover:text-white"
                />
              </button>
              <label
                htmlFor="postImages"
                className="p-1.5 cursor-pointer text-xs hover:text-white rounded-full font-medium text-center bg-white shadow text-slate-600  focus:ring-4 focus:ring-slate-200  hover:bg-slate-700"
              >
                <PhotoIcon className="stroke-2 block w-6  " />
              </label>
              <input
                name="postImages"
                id="postImages"
                type="file"
                multiple
                accept="image/*"
                className="hidden"
                {...register("image", {
                  onChange: onChangePostImages,
                })}
              />
              <button
                type="submit"
                disabled={isSubmitting}
                className="text-center  "
              >
                <ArrowUpCircleIcon className="w-9 text-indigo-500 shadow bg-white rounded-full hover:bg-indigo-500 hover:text-white" />
              </button>
            </div>
          </form>
          <div
            className="absolute bottom-2 left-1.5 flex text-orange-400 text-xs "
            role="alert"
          >
            {errors.content ? (
              <>{errors.content.message}</>
            ) : errors.topic ? (
              <>{errors.topic.message}</>
            ) : errors.postImages ? (
              <>{errors.postImages.message}</>
            ) : uploadPostImagesError ? (
              <>{uploadPostImagesError}</>
            ) : (
              ""
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

PostForm.propTypes = {
  onTogglePostForm: PropTypes.func,
  onTogglePostEditMode: PropTypes.func,
  post: PropTypes.object,
  postEditMode: PropTypes.bool,
  prevTopic: PropTypes.string,
  prevContent: PropTypes.string,
  prevPostImages: PropTypes.arrayOf(PropTypes.object),
};
export default PostForm;
