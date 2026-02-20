import { Box, Grid, Text } from '@chakra-ui/react'
import type { DashboardData, EntityPerformance, WaterSupplyOutageData } from '../../types'
import {
  AllStatesPerformanceChart,
  DemandSupplyChart,
  ImageSubmissionStatusChart,
  SupplySubmissionRateChart,
  WaterSupplyOutagesChart,
} from '../charts'
import { AllDistrictsTable } from '../tables'

type StateUtDashboardScreenProps = {
  data: DashboardData
  districtTableData: EntityPerformance[]
  supplySubmissionRateData: EntityPerformance[]
  supplySubmissionRateLabel: string
  waterSupplyOutagesData: WaterSupplyOutageData[]
}

export function StateUtDashboardScreen({
  data,
  districtTableData,
  supplySubmissionRateData,
  supplySubmissionRateLabel,
  waterSupplyOutagesData,
}: StateUtDashboardScreenProps) {
  return (
    <>
      {/* Submission + Outages Charts */}
      <Grid templateColumns={{ base: '1fr', lg: 'repeat(2, minmax(0, 1fr))' }} gap={6} mb={6}>
        <Box
          bg="white"
          borderWidth="0.5px"
          borderRadius="12px"
          borderColor="#E4E4E7"
          pt="24px"
          pb="24px"
          pl="16px"
          pr="16px"
          h="523px"
          w="full"
          minW={0}
        >
          <Text textStyle="bodyText3" fontWeight="400" mb="0px">
            Image Submission Status
          </Text>
          <ImageSubmissionStatusChart data={data.imageSubmissionStatus} height="406px" />
        </Box>
        <Box
          bg="white"
          borderWidth="0.5px"
          borderRadius="12px"
          borderColor="#E4E4E7"
          pt="24px"
          pb="24px"
          pl="16px"
          pr="16px"
          h="523px"
          w="full"
          minW={0}
        >
          <Text textStyle="bodyText3" fontWeight="400" mb={2}>
            Water Supply Outages
          </Text>
          <WaterSupplyOutagesChart
            data={waterSupplyOutagesData}
            height="400px"
            xAxisLabel="Districts"
          />
        </Box>
      </Grid>

      {/* Performance + Demand vs Supply Charts */}
      <Grid templateColumns={{ base: '1fr', lg: 'repeat(2, minmax(0, 1fr))' }} gap={6} mb={6}>
        <Box
          bg="white"
          borderWidth="1px"
          borderRadius="lg"
          p={4}
          h="536px"
          w="full"
          minW="250px"
          justifySelf={{ base: 'center', md: 'stretch' }}
        >
          <Text textStyle="bodyText3" fontWeight="400">
            All Districts Performance
          </Text>
          <AllStatesPerformanceChart
            data={districtTableData}
            height="440px"
            entityLabel="Districts"
          />
        </Box>
        <Box bg="white" borderWidth="1px" borderRadius="lg" p={4} h="536px" minW={0}>
          <Text textStyle="bodyText3" fontWeight="400" mb={2}>
            Demand vs Supply
          </Text>
          <DemandSupplyChart data={data.demandSupply} height="418px" />
        </Box>
      </Grid>

      {/* All Districts + Submission Rate */}
      <Grid templateColumns={{ base: '1fr', lg: 'repeat(2, minmax(0, 1fr))' }} gap={6} mb={6}>
        <Box bg="white" borderWidth="1px" borderRadius="lg" px={4} py={6} h="510px" minW={0}>
          <Text textStyle="bodyText3" fontWeight="400" mb="16px">
            All Districts
          </Text>
          <AllDistrictsTable data={districtTableData} />
        </Box>
        <Box bg="white" borderWidth="1px" borderRadius="lg" px={4} py={6} h="510px" minW={0}>
          <Text textStyle="bodyText3" fontWeight="400" mb={2}>
            Reading Submission Rate
          </Text>
          <SupplySubmissionRateChart
            data={supplySubmissionRateData}
            height="383px"
            entityLabel={supplySubmissionRateLabel}
          />
        </Box>
      </Grid>
    </>
  )
}
