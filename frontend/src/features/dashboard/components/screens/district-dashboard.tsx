import { Box, Flex, Grid, Text } from '@chakra-ui/react'
import type { DashboardData, EntityPerformance, PumpOperatorPerformanceData } from '../../types'
import {
  AllStatesPerformanceChart,
  DemandSupplyChart,
  PumpOperatorsChart,
  SupplySubmissionRateChart,
} from '../charts'
import { AllBlocksTable, PumpOperatorsPerformanceTable } from '../tables'

type DistrictDashboardScreenProps = {
  data: DashboardData
  blockTableData: EntityPerformance[]
  supplySubmissionRateData: EntityPerformance[]
  supplySubmissionRateLabel: string
  operatorsPerformanceTable: PumpOperatorPerformanceData[]
  pumpOperatorsTotal: number
}

export function DistrictDashboardScreen({
  data,
  blockTableData,
  supplySubmissionRateData,
  supplySubmissionRateLabel,
  operatorsPerformanceTable,
  pumpOperatorsTotal,
}: DistrictDashboardScreenProps) {
  return (
    <>
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
            All Blocks Performance
          </Text>
          <AllStatesPerformanceChart data={blockTableData} height="440px" entityLabel="Blocks" />
        </Box>
        <Box bg="white" borderWidth="1px" borderRadius="lg" p={4} h="536px" minW={0}>
          <Text textStyle="bodyText3" fontWeight="400" mb={2}>
            Demand vs Supply
          </Text>
          <DemandSupplyChart data={data.demandSupply} height="418px" />
        </Box>
      </Grid>

      {/* Pump Operators + Submission Rate */}
      <Grid templateColumns={{ base: '1fr', lg: 'repeat(2, minmax(0, 1fr))' }} gap={6} mb={6}>
        <Box bg="white" borderWidth="1px" borderRadius="lg" px={4} py={6} h="510px" minW={0}>
          <Flex align="center" justify="space-between" mb="40px">
            <Text textStyle="bodyText3" fontWeight="400">
              Pump Operators
            </Text>
            <Text textStyle="bodyText3" fontWeight="400">
              Total: {pumpOperatorsTotal}
            </Text>
          </Flex>
          <PumpOperatorsChart
            data={data.pumpOperators}
            height="360px"
            note="Note: Active pump operators submit readings at least 30 days in a month."
          />
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

      {/* Operators Performance + All Blocks */}
      <Grid templateColumns={{ base: '1fr', lg: 'repeat(2, 1fr)' }} gap={6} mb={6}>
        <Box
          bg="white"
          borderWidth="1px"
          borderRadius="lg"
          px={4}
          py={6}
          h="430px"
          w="full"
          minW={0}
        >
          <PumpOperatorsPerformanceTable
            title="Operators Performance Table"
            data={operatorsPerformanceTable}
          />
        </Box>
        <Box bg="white" borderWidth="1px" borderRadius="lg" px={4} py={6} h="430px">
          <Text textStyle="bodyText3" fontWeight="400" mb="16px">
            All Blocks
          </Text>
          <AllBlocksTable data={blockTableData} />
        </Box>
      </Grid>
    </>
  )
}
