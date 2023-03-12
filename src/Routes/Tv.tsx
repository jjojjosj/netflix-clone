import { AnimatePresence, motion, useScroll } from "framer-motion";
import { useState } from "react";
import { useQuery } from "react-query";
import { useHistory, useRouteMatch } from "react-router-dom";
import styled from "styled-components";
import { getTvs, IGetTvResult } from "../api";
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

const Banner = styled.div<{ bgphoto: string }>`
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 240px 60px 60px;
  background-image: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 1)),
    url(${(props) => props.bgphoto});
  background-size: cover;
`;

const Title = styled.h2`
  font-size: 64px;
  font-weight: bold;
  margin-bottom: 20px;
`;

const Overview = styled.p`
  font-size: 24px;
  width: 50%;
`;

const Slider = styled.div`
  position: relative;
  top: -100px;
`;

const SliderHeader = styled.h2`
  line-height: 1.3;
  margin: 0;
`;

const SliderTitle = styled.span`
  display: inline-block;
  font-size: 1.4vw;
  font-weight: 500;
  margin: 0 4% 0.5em;
`;

const Row = styled(motion.div)`
  display: grid;
  gap: 5px;
  grid-template-columns: repeat(6, 1fr);
  position: absolute;
  width: 100%;
  padding: 0 60px;
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

const offset = 6;

function Tv() {
  const history = useHistory();
  const bigTvMatch = useRouteMatch<{ tvId: string }>("/tv/:tvId");
  const { scrollY } = useScroll();
  const { data, isLoading } = useQuery<IGetTvResult>(
    ["tv", "topRated"],
    getTvs
  );
  const [index, setIndex] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const toggleLeaving = () => setLeaving((prev) => !prev);
  const increaseIndex = () => {
    if (data) {
      if (leaving) return;
      toggleLeaving();
      const totalContents = data.results.length - 1;
      const maxIndex = Math.floor(totalContents / offset) - 1;
      setIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
    }
  };
  const onBoxClicked = (tvId: number) => {
    history.push(`/tv/${tvId}`);
  };
  const onOverlayClick = () => {
    history.push(`/tv`);
  };
  const clickedTv =
    bigTvMatch?.params.tvId &&
    data?.results.find((tv) => tv.id === +bigTvMatch.params.tvId);

  return (
    <Wrapper>
      {" "}
      {isLoading ? (
        <Loader>Loading...</Loader>
      ) : (
        <>
          <Banner
            onClick={increaseIndex}
            bgphoto={makeImagePath(data?.results[0].backdrop_path || "")}
          >
            <Title>{data?.results[0].name}</Title>
            <Overview>{data?.results[0].overview}</Overview>
          </Banner>
          <Slider>
            <AnimatePresence initial={false} onExitComplete={toggleLeaving}>
              <SliderHeader>
                <SliderTitle>Top Rated TV Shows</SliderTitle>
              </SliderHeader>
              <Row
                variants={rowVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ type: "tween", duration: 1 }}
                key={index}
              >
                {data?.results
                  .slice(1)
                  .slice(offset * index, offset * index + offset)
                  .map((tv) => (
                    <Box
                      layoutId={tv.id + ""}
                      key={tv.id}
                      whileHover="hover"
                      initial="normal"
                      variants={boxVariants}
                      onClick={() => onBoxClicked(tv.id)}
                      transition={{ type: "tween" }}
                      bgphoto={makeImagePath(tv.backdrop_path, "w500")}
                    >
                      <Info variants={infoVariants}>
                        <h4>{tv.name}</h4>
                      </Info>
                    </Box>
                  ))}
              </Row>
            </AnimatePresence>
          </Slider>
          <AnimatePresence>
            {bigTvMatch ? (
              <>
                <Overlay
                  onClick={onOverlayClick}
                  exit={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                />
                <BigMovie
                  style={{
                    top: scrollY.get() + 100,
                  }}
                  layoutId={bigTvMatch.params.tvId}
                >
                  {clickedTv && (
                    <>
                      <BigCover
                        style={{
                          backgroundImage: `linear-gradient(to top, black, transparent), url(${makeImagePath(
                            clickedTv.backdrop_path,
                            "w500"
                          )})`,
                        }}
                      />
                      <BigPoster
                        style={{
                          backgroundImage: `url(${makeImagePath(
                            clickedTv.poster_path,
                            "w300"
                          )})`,
                        }}
                      ></BigPoster>
                      <BigTitle>{clickedTv.name}</BigTitle>
                      <BigOverview>{clickedTv.overview}</BigOverview>
                    </>
                  )}
                </BigMovie>
              </>
            ) : null}
          </AnimatePresence>
        </>
      )}
    </Wrapper>
  );
}
export default Tv;
