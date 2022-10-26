import {
  Box,
  Button,
  ButtonGroup,
  FormControl,
  FormErrorMessage,
  Input,
  FormLabel,
  VStack,
  Heading,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Alert,
  AlertIcon,
  Stack,
  AlertDialog,
  useDisclosure,
} from "@chakra-ui/react";
import { isArray } from "lodash";
import React, { useState } from "react";
import moment from "moment";
import { useFormik } from "formik";
import * as Yup from "yup";
import BigNumber from "bignumber.js";
import tokens from "./tokens";
import { useWeb3React } from "@web3-react/core";
import Web3 from "web3";
import bondLendingABI from "../src/bondLending.json";
import ERC20ABI from "../src/ERC20ABI.json";
import contracts from "./contracts";

class BondInformation {
  constructor(
    public bondName: string,
    public bondSymbol: string,
    public description: string,
    public totalSupply: string,
    public startSale: number,
    public active: number,
    public duration: number,
    public issuePrice: string
  ) {}
}
export enum AssetType {
  Token = 0,
  NFT = 1,
  Ether = 2,
}

class AssetInformation {
  constructor(
    public underlyingAsset: string,
    public collateralAmount: string,
    public faceAsset: string,
    public faceValue: string,
    public underlyingAssetType: AssetType,
    public faceAssetType: AssetType,
    public nftIds: number[],
    public priceFeedKeyUnderlyingAsset: string,
    public priceFeedKeyFaceAsset: string
  ) {}
}
export default function Bonds() {
  const cancelRef = React.useRef()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [transaction, setTransaction] = useState("");
  const { account, library } = useWeb3React();
  const onSubmit = async (values, actions) => {
    if (account) {
      const web3 = new Web3(library);
      const getContract = (abi: any, address: string) => {
        return new web3.eth.Contract(abi, address);
      };
      const getAddress = (address: any): string => {
        const mainNetChainId = 56;
        const chainId = process.env.REACT_APP_CHAIN_ID;
        return address[chainId === "56" ? mainNetChainId : 97];
      };
      const Max_256 =
        "115792089237316195423570985008687907853269984665640564039457584007913129639935";
      const getBep20Contract = () =>
        getContract(ERC20ABI, tokens?.posiv2?.address[97]);
      await getBep20Contract()
        .methods.approve(getAddress(contracts?.bondLendingFactory), Max_256)
        .send({ from: account });
      // alert(JSON.stringify(values,null,2));
      // console.log(values.bondName,"values");
      const bondInformation = new BondInformation(
        formik.values.bondName.trim(),
        formik.values.bondSymbol.trim().toUpperCase(),
        formik.values.description.trim(),
        new BigNumber(Number(formik.values.units))
          .times(new BigNumber(10).pow(18))
          .toFixed(),
        moment(formik.values.timeOnSale).unix(),
        moment(formik.values.timeActive).unix(),
        formik.values.duration,
        new BigNumber(
          (
            Number(
              (
                Number(formik.values.collateralAmount) *
                0.99 *
                0.65 *
                0.099
              ).toFixed(2)
            ) / Number(formik.values.units)
          ).toFixed(2)
        )
          .times(new BigNumber(10).pow(18))
          .toFixed()
      );
      //   const getBondLendingFactoryContract = (web3?: Web3) => {
      //     return getContract(bondLendingABI, getAddress(contracts.bondLendingFactory), web3);
      //   };
      const assetInformationAmount = new AssetInformation(
        "0x2A0151ad6Ead421e5325c4B6808A9fd5e0440A36",
        new BigNumber(Number(formik.values.collateralAmount))
          .times(new BigNumber(10).pow(18))
          .toFixed(),
        getAddress(tokens?.busd.address),
        new BigNumber(Number(formik.values.faceValue))
          .times(new BigNumber(10).pow(18))
          .toFixed(),
        AssetType.Token,
        AssetType.Token,
        [],
        "0x55d2869f370daaffba57815991e444b42018737d219b5b35c2cf5aebdacf3589",
        "0x55d2869f370daaffba57815991e444b42018737d219b5b35c2cf5aebdacf3588"
      );
      const getBondLendingFactory = () =>
        getContract(
          bondLendingABI,
          "0x5939269359add646aBe56CDF647713d03BD2Bcd4"
        );

      getBondLendingFactory()
        .methods.issueBond(
          Object.values(bondInformation).map((v) =>
            isArray(v) ? v : isFinite(v) ? v.toString() : v
          ),
          Object.values(assetInformationAmount).map((v) =>
            isArray(v) ? v : isFinite(v) ? v.toString() : v
          )
        )
        .send({ from: account }, async (err, hash) => {
          if (hash) {
            setTransaction(hash);
            console.log("doneeeeeeeeeee");
          }
        });
    }
  };
  const formik = useFormik({
    initialValues: {
      bondName: "",
      bondSymbol: "",
      description: "",
      collateralAmount: null,
      collateralType: "POSI",
      selectedNfts: [], //
      borrowValue: null,
      units: null,
      issuePrice: null,
      faceValue: null, //
      ytm: null,
      duration: 365,
      repaymentTerms: "Face value", //
      durationUnit: "Day", //
      borrowSymbol: "BUSD", //
      selectedNFTs: [], //
      timeOnSale: moment().add(1.5, "hours").toDate(), //
      timeActive: moment().add(1.5, "hours").add(1, "day").toDate(), //
      timeMaturity: moment()
        .add(1.5, "hours")
        .add(1, "day")
        .add(1, "year")
        .toDate(), //
    },
    onSubmit,
  });
  // const ACTUAL_COLLATERAL_AMOUNT_RATE = 0.99;

  return (
    <>
      <form onSubmit={formik.handleSubmit}>
        <Heading>Bonds</Heading>
        <FormControl>
          <FormLabel>Bond name</FormLabel>
          <Input
            onChange={formik.handleChange}
            value={formik.values.bondName}
            variant="outline"
            name="bondName"
            placeholder="Please enter less 30 characters"
          ></Input>
        </FormControl>
        <FormControl>
          <FormLabel>Bond symbol</FormLabel>
          <Input
            onChange={formik.handleChange}
            value={formik.values.bondSymbol}
            variant="outline"
            name="bondSymbol"
            placeholder="Please enter less 6 characters"
          ></Input>
        </FormControl>
        <FormControl>
          <FormLabel>Description</FormLabel>
          <Input
            onChange={formik.handleChange}
            value={formik.values.description}
            variant="outline"
            name="description"
            placeholder="Please enter less 30 characters"
          ></Input>
        </FormControl>
        <FormControl>
          <FormLabel>Collateral amount</FormLabel>
          <Input
            onChange={formik.handleChange}
            value={formik.values.collateralAmount ?? ""}
            variant="outline"
            name="collateralAmount"
            placeholder="Enter your value for colleteral with 10k POSI minium"
          ></Input>
        </FormControl>
        <FormControl>
          <FormLabel>Actual collateral amount</FormLabel>
          <Input
            onChange={formik.handleChange}
            value={
              formik.values.collateralAmount
                ? (Number(formik.values.collateralAmount) * 0.99).toFixed(2)
                : ""
            }
            variant="outline"
            name=""
            placeholder="Please enter less 30 characters"
          ></Input>
        </FormControl>
        <FormControl>
          <FormLabel>Value to borrrow (BUSD)</FormLabel>
          <Input
            onChange={formik.handleChange}
            value={
              formik.values.collateralAmount
                ? (
                    Number(formik.values.collateralAmount) *
                    0.99 *
                    0.65 *
                    0.099
                  ).toFixed(2)
                : ""
            }
            variant="outline"
            name="borrowValue"
            placeholder="Maxium 65 percent"
          ></Input>
        </FormControl>
        <FormControl>
          <FormLabel>Units (BOND)</FormLabel>
          <Input
            onChange={formik.handleChange}
            value={formik.values.units ?? ""}
            variant="outline"
            name="units"
            placeholder="Input an integer"
          ></Input>
        </FormControl>
        <FormControl>
          <FormLabel>Issue price (BUSD)</FormLabel>
          <Input
            onChange={formik.handleChange}
            value={
              formik.values.units
                ? (
                    Number(
                      (
                        Number(formik.values.collateralAmount) *
                        0.99 *
                        0.65 *
                        0.099
                      ).toFixed(2)
                    ) / formik.values.units
                  ).toFixed(2)
                : ""
            }
            variant="outline"
            name="issuePrice"
            placeholder="Enter the price you want to sell"
          ></Input>
        </FormControl>
        <FormControl>
          <FormLabel>faceValue (BUSD)</FormLabel>
          <Input
            onChange={formik.handleChange}
            value={formik.values.faceValue ?? ""}
            variant="outline"
            name="faceValue"
            placeholder="Enter the price you want to sell"
          ></Input>
        </FormControl>
        <FormControl>
          <FormLabel>YTM</FormLabel>
          <Input
            onChange={formik.handleChange}
            value={
              formik.values.faceValue
                ? (Number(formik.values.faceValue) /
                    ((Number(formik.values.collateralAmount) *
                      0.99 *
                      0.65 *
                      0.09867909867909866) /
                      Number(formik.values.units))) *
                    100 -
                  100
                : formik.values.ytm ?? ""
            }
            variant="outline"
            name="ytm"
            placeholder="Enter YTM of the bond"
          ></Input>
        </FormControl>
        <FormControl>
          <FormLabel>Bond duration</FormLabel>
          <Input
            onChange={formik.handleChange}
            value={formik.values.duration}
            variant="outline"
            name="duration"
            placeholder="Maxium 65 percent"
          ></Input>
        </FormControl>
        {/* <FormControl>
        <FormLabel>Interest repayment terms</FormLabel>
        <Input onChange={formik.handleChange} value={formik.values.bondSymbol} variant='outline' name="username" placeholder='Maxium 65 percent'></Input>
    </FormControl>
    <FormControl>
        <FormLabel>Time for each phase</FormLabel>
        <Input onChange={formik.handleChange} value={formik.values.bondSymbol} variant='outline' name="username" placeholder='Maxium 65 percent'></Input>
    </FormControl> */}
        <Button type="submit">Issue Bond</Button>
      {transaction ? (
          <Alert status="success">
            Issue Bonds Success!!!
          </Alert>
      ) : (
        <p></p>
      )}
      </form>
    </>
  );
}
