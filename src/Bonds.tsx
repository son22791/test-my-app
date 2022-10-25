import { Box, Button, ButtonGroup, FormControl, FormErrorMessage, Input,FormLabel, VStack, Heading } from '@chakra-ui/react'
import { isDisabled } from '@testing-library/user-event/dist/utils';
import { floor, isEqual, isNaN, lowerCase, round } from 'lodash';
import React from 'react'
import moment from 'moment';
import { useFormik } from 'formik';
export default function Bonds() {
    const formik = useFormik({
        initialValues:{
            bondName : "",
            bondSymbol:"",
            description:"",
            collateralAmount: null,
            collateralType: 'POSI',
            selectedNfts: [], //
            borrowValue: null,
            units: null,
            issuePrice: null,
            faceValue: null, //
            ytm: null,
            duration: 365,
            repaymentTerms: 'Face value', //
            durationUnit: 'Day', //
            borrowSymbol: 'BUSD', //
            selectedNFTs: [], //
            timeOnSale: moment().add(1.5, 'hours').toDate(), //
            timeActive: moment().add(1.5, 'hours').add(1, 'day').toDate(), //
            timeMaturity: moment().add(1.5, 'hours').add(1, 'day').add(1, 'year').toDate(), //
      },
      onSubmit: (values, actions) =>{
        alert(JSON.stringify(values,null,2));
        actions.resetForm();
      }
    })
    const ACTUAL_COLLATERAL_AMOUNT_RATE = 0.99;
  return (
   <VStack as="form" mx="auto" w= {{base: "90%" , md:500}} h ="100vh"  >
    <Heading>Bonds</Heading>
    <FormControl><FormLabel>Bond name</FormLabel>
        <Input onChange={formik.handleChange} value={formik.values.bondName} variant='outline' name="bondName" placeholder='Please enter less 30 characters'></Input>
    </FormControl>
    <FormControl>
        <FormLabel>Bond symbol</FormLabel>
        <Input onChange={formik.handleChange} value={formik.values.bondSymbol} variant='outline' name="bondSymbol" placeholder='Please enter less 6 characters'></Input>
    </FormControl>
    <FormControl>
        <FormLabel>Description</FormLabel>
        <Input onChange={formik.handleChange} value={formik.values.description} variant='outline' name="description" placeholder='Please enter less 30 characters'></Input>
    </FormControl>
    <FormControl>
        <FormLabel>Collateral amount</FormLabel>
        <Input onChange={formik.handleChange} value={formik.values.collateralAmount?? ""} variant='outline' name="collateralAmount" placeholder='Enter your value for colleteral with 10k POSI minium'></Input>
    </FormControl>
    <FormControl>
        <FormLabel>Actual collateral amount</FormLabel>
        <Input onChange={formik.handleChange} value={Number(formik.values.collateralAmount)*0.99?? ""} variant='outline' name="" placeholder='Please enter less 30 characters'></Input>
    </FormControl>
    <FormControl>
        <FormLabel>Value to borrrow (BUSD)</FormLabel>
        <Input onChange={formik.handleChange} value={Number(formik.values.collateralAmount)*0.99*0.65*0.099?? ""} variant='outline' name="borrowValue" placeholder='Maxium 65 percent'></Input>
    </FormControl>
    <FormControl>
        <FormLabel>Units (BOND)</FormLabel>
        <Input onChange={formik.handleChange} value={formik.values.units??""} variant='outline' name="units" placeholder='Input an integer'></Input>
    </FormControl>
    <FormControl>
        <FormLabel>Issue price (BUSD)</FormLabel>
        <Input onChange={formik.handleChange} value={formik.values.units?(Number(formik.values.collateralAmount)*0.99*0.65*0.099)/Number(formik.values.units):""} variant='outline' name="issuePrice" placeholder='Enter the price you want to sell'></Input>
    </FormControl>
    <FormControl>
        <FormLabel>faceValue (BUSD)</FormLabel>
        <Input onChange={formik.handleChange} value={formik.values.issuePrice??""} variant='outline' name="faceValue" placeholder='Enter the price you want to sell'></Input>
    </FormControl>
    <FormControl>
        <FormLabel>YTM</FormLabel>
        <Input onChange={formik.handleChange} value={formik.values.ytm??""} variant='outline' name="ytm" placeholder='Enter YTM of the bond'></Input>
    </FormControl>
    <FormControl>
        <FormLabel>Bond duration</FormLabel>
        <Input onChange={formik.handleChange} value={formik.values.duration} variant='outline' name="duration" placeholder='Maxium 65 percent'></Input>
    </FormControl>
    <FormControl>
        <FormLabel>Interest repayment terms</FormLabel>
        <Input onChange={formik.handleChange} value={formik.values.bondSymbol} variant='outline' name="username" placeholder='Maxium 65 percent'></Input>
    </FormControl>
    <FormControl>
        <FormLabel>Time for each phase</FormLabel>
        <Input onChange={formik.handleChange} value={formik.values.bondSymbol} variant='outline' name="username" placeholder='Maxium 65 percent'></Input>
    </FormControl>
    <Button>
        Issue Bond
    </Button>
   </VStack>
  );
}
