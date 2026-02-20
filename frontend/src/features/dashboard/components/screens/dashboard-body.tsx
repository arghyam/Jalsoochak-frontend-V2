import { Box, Flex, Grid, Select, Text } from '@chakra-ui/react'
import type {
  DashboardData,
  EntityPerformance,
  PumpOperatorPerformanceData,
  WaterSupplyOutageData,
} from '../../types'
import { AllStatesPerformanceChart, DemandSupplyChart, SupplySubmissionRateChart } from '../charts'
import { AllStatesTable } from '../tables'
import { BlockDashboardScreen } from './block-dashboard'
import { DistrictDashboardScreen } from './district-dashboard'
import { GramPanchayatDashboardScreen } from './gram-panchayat-dashboard'
import { StateUtDashboardScreen } from './state-ut-dashboard'
import { VillageDashboardScreen } from './village-dashboard'

type DashboardBodyProps = {
  data: DashboardData
  isStateSelected: boolean
  isDistrictSelected: boolean
  isBlockSelected: boolean
  isGramPanchayatSelected: boolean
  selectedVillage: string
  performanceState: string
  onPerformanceStateChange: (value: string) => void
  districtTableData: EntityPerformance[]
  blockTableData: EntityPerformance[]
  gramPanchayatTableData: EntityPerformance[]
  villageTableData: EntityPerformance[]
  supplySubmissionRateData: EntityPerformance[]
  supplySubmissionRateLabel: string
  waterSupplyOutagesData: WaterSupplyOutageData[]
  pumpOperatorsTotal: number
  operatorsPerformanceTable: PumpOperatorPerformanceData[]
  villagePhotoEvidenceRows: DashboardData['photoEvidenceCompliance']
}

export function DashboardBody({
  data,
  isStateSelected,
  isDistrictSelected,
  isBlockSelected,
  isGramPanchayatSelected,
  selectedVillage,
  performanceState,
  onPerformanceStateChange,
  districtTableData,
  blockTableData,
  gramPanchayatTableData,
  villageTableData,
  supplySubmissionRateData,
  supplySubmissionRateLabel,
  waterSupplyOutagesData,
  pumpOperatorsTotal,
  operatorsPerformanceTable,
  villagePhotoEvidenceRows,
}: DashboardBodyProps) {
  const isStateScreen =
    isStateSelected &&
    !isDistrictSelected &&
    !isBlockSelected &&
    !isGramPanchayatSelected &&
    !selectedVillage
  const isDistrictScreen =
    isDistrictSelected && !isBlockSelected && !isGramPanchayatSelected && !selectedVillage
  const isBlockScreen = isBlockSelected && !isGramPanchayatSelected && !selectedVillage
  const isGramPanchayatScreen = isGramPanchayatSelected && !selectedVillage

  return (
    <>
      {isStateScreen ? (
        <StateUtDashboardScreen
          data={data}
          districtTableData={districtTableData}
          supplySubmissionRateData={supplySubmissionRateData}
          supplySubmissionRateLabel={supplySubmissionRateLabel}
          waterSupplyOutagesData={waterSupplyOutagesData}
        />
      ) : null}
      {isDistrictScreen ? (
        <DistrictDashboardScreen
          data={data}
          blockTableData={blockTableData}
          supplySubmissionRateData={supplySubmissionRateData}
          supplySubmissionRateLabel={supplySubmissionRateLabel}
          operatorsPerformanceTable={operatorsPerformanceTable}
          pumpOperatorsTotal={pumpOperatorsTotal}
        />
      ) : null}
      {isBlockScreen ? (
        <BlockDashboardScreen
          data={data}
          gramPanchayatTableData={gramPanchayatTableData}
          supplySubmissionRateData={supplySubmissionRateData}
          supplySubmissionRateLabel={supplySubmissionRateLabel}
          pumpOperatorsTotal={pumpOperatorsTotal}
          operatorsPerformanceTable={operatorsPerformanceTable}
        />
      ) : null}
      {isGramPanchayatScreen ? (
        <GramPanchayatDashboardScreen
          data={data}
          villageTableData={villageTableData}
          supplySubmissionRateData={supplySubmissionRateData}
          supplySubmissionRateLabel={supplySubmissionRateLabel}
          pumpOperatorsTotal={pumpOperatorsTotal}
          operatorsPerformanceTable={operatorsPerformanceTable}
        />
      ) : null}

      {selectedVillage ? (
        <VillageDashboardScreen
          data={data}
          villagePhotoEvidenceRows={villagePhotoEvidenceRows}
          waterSupplyOutagesData={waterSupplyOutagesData}
        />
      ) : null}

      {/* Performance + Demand vs Supply Charts */}
      {!selectedVillage &&
      !isStateScreen &&
      !isDistrictScreen &&
      !isBlockScreen &&
      !isGramPanchayatScreen ? (
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
            <Flex align="center" justify="space-between">
              <Text textStyle="bodyText3" fontWeight="400">
                All States/UTs Performance
              </Text>
              {!isStateSelected &&
              !isDistrictSelected &&
              !isBlockSelected &&
              !isGramPanchayatSelected ? (
                <Select
                  h="32px"
                  maxW="120px"
                  fontSize="14px"
                  fontWeight="600"
                  borderRadius="4px"
                  borderColor="neutral.400"
                  borderWidth="1px"
                  bg="white"
                  color="neutral.400"
                  placeholder="Select"
                  appearance="none"
                  value={performanceState}
                  onChange={(event) => onPerformanceStateChange(event.target.value)}
                  _focus={{
                    borderColor: 'primary.500',
                    boxShadow: 'none',
                  }}
                >
                  <option value="Punjab">Punjab</option>
                </Select>
              ) : null}
            </Flex>
            <AllStatesPerformanceChart
              data={
                performanceState
                  ? data.mapData.filter((state) => state.name === performanceState).slice(0, 1)
                  : data.mapData
              }
              height="440px"
              entityLabel="States/UTs"
            />
          </Box>
          <Box bg="white" borderWidth="1px" borderRadius="lg" p={4} h="536px" minW={0}>
            <Text textStyle="bodyText3" fontWeight="400" mb={2}>
              Demand vs Supply
            </Text>
            <DemandSupplyChart data={data.demandSupply} height="418px" />
          </Box>
        </Grid>
      ) : null}

      {/* All Gram Panchayats/Villages + Pump Operators */}
      {/* All States/Districts/Pump Operators + Submission Rate */}
      {!selectedVillage &&
      !isStateScreen &&
      !isDistrictScreen &&
      !isBlockSelected &&
      !isGramPanchayatScreen ? (
        <Grid templateColumns={{ base: '1fr', lg: 'repeat(2, minmax(0, 1fr))' }} gap={6} mb={6}>
          <Box bg="white" borderWidth="1px" borderRadius="lg" px={4} py={6} h="510px" minW={0}>
            <>
              <Text textStyle="bodyText3" fontWeight="400" mb="16px">
                All States/UTs
              </Text>
              <AllStatesTable data={data.mapData} />
            </>
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
      ) : null}
    </>
  )
}
