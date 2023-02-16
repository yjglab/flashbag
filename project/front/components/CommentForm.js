import { ArrowUpCircleIcon, XMarkIcon } from "@heroicons/react/20/solid";
import React, { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { genComment } from "../db";
import useInput from "../hooks/useInput";
import { UPLOAD_COMMENT_REQUEST } from "../reducers/post";
import PropTypes from "prop-types";
import { useForm } from "react-hook-form";

const CommentForm = ({ post, onToggleCommentSection }) => {
  const dispatch = useDispatch();
  const { me } = useSelector((state) => state.user);

  const {
    register,
    reset,
    handleSubmit,
    watch,
    setError,
    formState: { isSubmitting, errors },
  } = useForm({
    mode: "onSubmit",
    defaultValues: {
      content: "",
    },
  });

  const id = useSelector((state) => state.user.me?.id);
  const onUploadComment = (formData) => {
    if (!id) return alert("로그인이 필요합니다.");

    const { content } = formData;
    if (!content.trim()) {
      return setError("content", {
        message: "빈 코멘트를 업로드할 수 없습니다",
      });
    }
    reset();

    return dispatch({
      type: UPLOAD_COMMENT_REQUEST,
      data: { content, postId: post.id, userId: id },
    });
  };

  return (
    <form
      onSubmit={handleSubmit(onUploadComment)}
      className="mb-4 mt-4 bottom-1 relative"
    >
      <div className="w-full flex items-center">
        <label htmlFor="content" className="sr-only"></label>
        <textarea
          id="content"
          maxLength={800}
          rows="3"
          className="px-2  border border-slate-200 rounded-xl w-full text-sm sm:text-sm md:text-md  focus:ring-0 focus:outline-none placeholder:text-slate-300"
          placeholder={`${me?.username}님의 의견을 들려주세요.`}
          {...register("content", {
            required: "내용을 입력해주세요",
            maxLength: {
              value: 800,
              message: "800자 이내로 입력해주세요",
            },
          })}
        ></textarea>
      </div>
      <div className="flex items-center mt-1 justify-between">
        <button type="button" className=" rounded-full flex items-center">
          <XMarkIcon
            onClick={onToggleCommentSection}
            className="w-7 text-slate-600 "
          />
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className=" rounded-full flex items-center"
        >
          <ArrowUpCircleIcon className="w-7 text-indigo-500 hover:text-indigo-600" />
        </button>
      </div>
    </form>
  );
};

CommentForm.propTypes = {
  post: PropTypes.object.isRequired,
  onToggleCommentSection: PropTypes.func.isRequired,
};
export default CommentForm;
