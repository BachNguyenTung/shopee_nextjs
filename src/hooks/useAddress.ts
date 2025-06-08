import { SyntheticEvent, useEffect, useState } from "react";
import ProvincesCitiesVN, { District, Province, Ward } from "pc-vn";

interface AddressInfo {
  name?: string;
  phone?: string;
  street?: string;
  province?: Province | null;
  district?: District | null;
  ward?: Ward | null;
}

interface ProvinceWithShipPrice extends Province {
  shipPrice: number[];
  name: string;
}

const useAddress = (
  editShipInfo?: AddressInfo,
  isAddressAddShowing?: boolean,
  shipInfoIndex?: number | null
) => {
  //TODO: change to 1 state address, update multiple state with cb func
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [street, setStreet] = useState("");
  const [province, setProvince] = useState<Province | null>(null);
  const [district, setDistrict] = useState<District | null>(null);
  const [ward, setWard] = useState<Ward | null>(null);
  const [provinces, setProvinces] = useState<ProvinceWithShipPrice[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [wards, setWards] = useState<Ward[]>([]);

  const handleProvinceChoose = (e: SyntheticEvent, value: string) => {
    const province = provinces.find((province) => province.name === value);
    setDistrict(null);
    setWard(null);
    setProvince(province || null);
  };

  const handleDistrictChoose = (e: SyntheticEvent, value: string) => {
    const district = districts.find((district) => district.name === value);
    setWard(null);
    setDistrict(district || null);
  };

  const handleWardChoose = (e: SyntheticEvent, value: string) => {
    const ward = wards.find((ward) => ward.name === value);
    setWard(ward || null);
  };

  useEffect(() => {
    if (shipInfoIndex == null) {
      setName("");
      setPhone("");
      setStreet("");
      setProvince(null);
      setDistrict(null);
      setWard(null);
      return;
    }
    const name = editShipInfo?.name ?? "";
    const phone = editShipInfo?.phone ?? "";
    const street = editShipInfo?.street ?? "";
    const province = editShipInfo?.province ?? null;
    const district = editShipInfo?.district ?? null;
    const ward = editShipInfo?.ward ?? null;
    setName(name);
    setPhone(phone);
    setStreet(street);
    setProvince(province);
    setDistrict(district);
    setWard(ward);
  }, [isAddressAddShowing, editShipInfo, shipInfoIndex]);

  //Get and set province and set districts and district depend on province
  useEffect(() => {
    const provinces = ProvincesCitiesVN.getProvinces();
    const provincesWithShipPrice = provinces.map((item: Province, index: number) => {
      return {
        ...item,
        shipPrice: [10000 + 2000 * index, 15000 + 2000 * index],
      };
    });
    setProvinces(provincesWithShipPrice);

    if (province) {
      const districts = ProvincesCitiesVN.getDistrictsByProvinceCode(
        province.code
      );
      setDistricts(districts);
    }

    if (district) {
      const wards = ProvincesCitiesVN.getWardsByDistrictCode(district.code);
      setWards(wards);
    }
  }, [district, province, ward]);

  return {
    name,
    setName,
    phone,
    setPhone,
    street,
    setStreet,
    provinces,
    districts,
    wards,
    province,
    setProvince,
    district,
    setDistrict,
    ward,
    setWard,
    handleDistrictChoose,
    handleProvinceChoose,
    handleWardChoose,
  };
};

export default useAddress;
