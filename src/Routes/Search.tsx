import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { useQuery } from "react-query";
import { useHistory, useLocation, useRouteMatch } from "react-router-dom";
import styled from "styled-components";
import { getSearch, IGetMultiSearchResult } from "../api";
import { makeImagePath } from "../utils";

const Wrapper = styled.div`
  background-color: black;
`;

const Loader = styled.div`
  height: 20vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Blank = styled.div`
  display: flex;
  flex-direction: column;
  height: 160px;
`;

const Row = styled(motion.div)`
  display: grid;
  gap: 5px;
  grid-template-columns: repeat(5, 1fr);
  position: relative;
  width: 100%;
  padding: 10px 60px;
`;

const Box = styled(motion.div)<{ bgphoto: string }>`
  background-color: white;
  background-image: url(${(props) => props.bgphoto});
  background-size: cover;
  background-position: center center;
  height: 130px;
  font-size: 66px;
  cursor: pointer;
  border-radius: 5px;
  &:first-child {
    transform-origin: center left;
  }
  &:last-child {
    transform-origin: center right;
  }
`;

const Info = styled(motion.div)`
  padding: 10px;
  background-color: ${(props) => props.theme.black.lighter};
  opacity: 0;
  position: absolute;
  width: 100%;
  bottom: 0;
  border-radius: 5px;
  h4 {
    text-align: center;
    font-size: 18px;
  }
`;

const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  opacity: 0;
`;

const BigMovie = styled(motion.div)`
  position: absolute;
  width: 60vw;
  height: 80vh;
  left: 0;
  right: 0;
  margin: 0 auto;
  border-radius: 15px;
  overflow: hidden;
  background-color: ${(props) => props.theme.black.lighter};
  overflow-y: scroll;
`;

const BigCover = styled.div`
  position: relative;
  width: 100%;
  background-size: cover;
  background-position: center center;
  height: 510px;
  z-index: 1;
`;

const BigPoster = styled.div`
  top: -120px;
  z-index: 2;
  position: relative;
  display: flex;
  width: 300px;
  background-size: cover;
  background-position: center center;
  height: 450px;
`;

const BigTitle = styled.h3`
  display: flex;
  color: ${(props) => props.theme.white.lighter};
  padding: 0 20px 0 33%;
  font-size: 36px;
  position: relative;
  top: -300px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  z-index: 2;
`;

const BigOverview = styled.p`
  padding: 0 20px 0 33%;
  position: relative;
  color: ${(props) => props.theme.white.lighter};
  top: -300px;
  display: flex;
`;

const rowVariants = {
  hidden: {
    x: window.outerWidth + 5,
  },
  visible: {
    x: 0,
  },
  exit: {
    x: -window.outerWidth - 5,
  },
};

const boxVariants = {
  normal: {
    scale: 1,
  },
  hover: {
    scale: 1.3,
    y: -50,
    transition: {
      delay: 0.5,
      duration: 0.3,
      type: "tween",
    },
  },
};

const infoVariants = {
  hover: {
    opacity: 1,
    transition: {
      delay: 0.5,
      duration: 0.3,
      type: "tween",
    },
  },
};

const offset = 5;

function Search() {
  const history = useHistory();
  const location = useLocation();
  const keyword = new URLSearchParams(location.search).get("keyword") || "";
  const { data, isLoading } = useQuery<IGetMultiSearchResult>(
    ["search", "multi"],
    () => getSearch(keyword)
  );
  const totalMovies = data?.results.length || 0;
  const numOfRows = Math.ceil(totalMovies / offset);
  const onOverlayClick = () => {
    history.goBack();
  };
  return (
    <Wrapper>
      <Blank />
      {isLoading ? (
        <Loader>Loading...</Loader>
      ) : (
        <>
          {Array.from({ length: numOfRows }, (_, i) => i).map((index) => (
            <Row
              variants={rowVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={{ type: "tween", duration: 1 }}
              key={index}
            >
              {data?.results
                .slice(offset * index, offset * index + offset)
                .map((content) => (
                  <Box
                    layoutId={content.id + ""}
                    key={content.id}
                    whileHover="hover"
                    initial="normal"
                    variants={boxVariants}
                    transition={{ type: "tween" }}
                    bgphoto={makeImagePath(content.backdrop_path, "w500")}
                  >
                    <Info variants={infoVariants}>
                      <h4>{content.title || content.name}</h4>
                    </Info>
                  </Box>
                ))}
            </Row>
          ))}
        </>
      )}
    </Wrapper>
  );
}
export default Search;
