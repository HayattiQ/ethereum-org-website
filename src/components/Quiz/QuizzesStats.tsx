import { useContext } from "react"
import { useI18next } from "gatsby-plugin-react-i18next"
import { useRouter } from "next/router"
import { useTranslation } from "next-i18next"
import { FaTwitter } from "react-icons/fa"
import { FaTwitter } from "react-icons/fa"
import {
  Box,
  Circle,
  Flex,
  Grid,
  GridItem,
  Progress,
  Stack,
  Text,
} from "@chakra-ui/react"

import { ethereumBasicsQuizzes, usingEthereumQuizzes } from "../../data/quizzes"
import { QuizShareStats } from "../../types"
import { trackCustomEvent } from "../../utils/matomo"
import { Button } from "../Buttons"
import { TrophyIcon } from "../icons/quiz"
import Translation from "../Translation"

import { QuizzesHubContext } from "./context"
import {
  getFormattedStats,
  getNumberOfCompletedQuizzes,
  getTotalQuizzesPoints,
  shareOnTwitter,
} from "./utils"

const handleShare = ({ score, total }: QuizShareStats) => {
  shareOnTwitter({
    score,
    total,
  })

  trackCustomEvent({
    eventCategory: "quiz_hub_events",
    eventAction: "Secondary button clicks",
    eventName: "Twitter_share_stats",
  })
}

const QuizzesStats: React.FC = () => {
  const { locale } = useRouter()
  const { t } = useTranslation("learn-quizzes")
  const {
    userStats: { score: userScore, completed, average },
  } = useContext(QuizzesHubContext)
  const numberOfCompletedQuizzes = getNumberOfCompletedQuizzes(
    JSON.parse(completed)
  )

  // These values are not fixed but calculated each time, can't be moved to /constants
  const totalQuizzesNumber =
    ethereumBasicsQuizzes.length + usingEthereumQuizzes.length
  const totalQuizzesPoints = getTotalQuizzesPoints()

  const {
    formattedUserAverageScore,
    formattedCollectiveQuestionsAnswered,
    formattedCollectiveAverageScore,
    formattedCollectiveRetryRate,
  } = getFormattedStats(locale!, average)

  return (
    <Box flex={1} order={{ base: 1, lg: 2 }} w="full">
      <Stack mt={{ base: 0, lg: 12 }} gap={{ base: 8, lg: 4 }}>
        {/* user stats */}
        <Grid
          gap={4}
          bg="background.highlight"
          borderRadius={{ base: "none", lg: "lg" }}
          border="none"
          p={8}
          mb={-2}
        >
          <GridItem colSpan={{ base: 2, lg: 1 }} alignSelf="center" order={1}>
            <Text
              color="body.base"
              fontWeight="bold"
              fontSize="xl"
              margin={0}
              textAlign={{ base: "center", lg: "left" }}
            >
              {t("your-total")}
            </Text>
          </GridItem>

          <GridItem
            colSpan={{ base: 2, lg: 1 }}
            justifySelf={{ base: "auto", lg: "end" }}
            alignSelf="center"
            order={{ base: 3, lg: 2 }}
          >
            <Button
              variant="outline-color"
              leftIcon={<FaTwitter />}
              onClick={() =>
                handleShare({ score: userScore, total: totalQuizzesPoints })
              }
              w={{ base: "full", lg: "auto" }}
              mt={{ base: 2, lg: 0 }}
            >
              {t("share-results")}
            </Button>
          </GridItem>

          <GridItem colSpan={2} order={{ base: 2, lg: 3 }}>
            <Stack gap={2}>
              <Flex
                justifyContent={{ base: "center", lg: "flex-start" }}
                alignItems="center"
              >
                <Circle size="64px" bg="primary.base" mr={4}>
                  <TrophyIcon color="neutral" w="35.62px" h="35.62px" />
                </Circle>

                <Text fontWeight="bold" fontSize="5xl" mb={0} color="body.base">
                  {userScore}
                  <Text as="span" color="body.medium">
                    /{totalQuizzesPoints}
                  </Text>
                </Text>
              </Flex>

              <Progress value={(userScore / totalQuizzesPoints) * 100} />

              <Flex direction={{ base: "column", lg: "row" }}>
                <Text
                  mr={10}
                  mb={0}
                  mt={{ base: 2, lg: 0 }}
                  color="body.medium"
                >
                  {t("average-score")}{" "}
                  <Text as="span" color="body.base">
                    {formattedUserAverageScore}
                  </Text>
                </Text>

                <Text mb={0} color="body.medium">
                  {t("completed")}{" "}
                  <Text as="span" color="body.base">
                    {numberOfCompletedQuizzes}/{totalQuizzesNumber}
                  </Text>
                </Text>
              </Flex>
            </Stack>
          </GridItem>
        </Grid>

        {/* community stats */}
        <Flex
          direction="column"
          gap={6}
          justifyContent="space-between"
          bg="background.highlight"
          borderRadius={{ base: "none", lg: "lg" }}
          border="none"
          p={8}
        >
          <Text color="body.base" fontWeight="bold" fontSize="xl" mb={0}>
            {t("community-stats")}
          </Text>

          <Flex
            direction={{ base: "column", md: "row" }}
            gap={{ base: 6, md: 10 }}
          >
            <Stack>
              <Text mr={10} mb={-2} color="body.medium">
                {t("average-score")}
              </Text>
              {/* Data from Matomo, manually updated */}
              <Text color="body.base">{formattedCollectiveAverageScore}</Text>
            </Stack>

            <Stack>
              <Text mr={10} mb={-2} color="body.medium">
                {t("questions-answered")}
              </Text>

              {/* Data from Matomo, manually updated */}
              <Text color="body.base">
                {formattedCollectiveQuestionsAnswered}
                <Text as="span">+</Text>
              </Text>
            </Stack>

            <Stack>
              <Text mr={10} mb={-2} color="body.medium">
                {t("retry")}
              </Text>

              {/* Data from Matomo, manually updated */}
              <Text color="body.base">{formattedCollectiveRetryRate}</Text>
            </Stack>
          </Flex>
        </Flex>
      </Stack>
    </Box>
  )
}

export default QuizzesStats
