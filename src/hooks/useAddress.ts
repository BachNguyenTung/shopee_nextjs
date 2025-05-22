import { useEffect, useState } from "react";
import ProvincesCitiesVN from "pc-vn";


const useAddress = (editShipInfo?: any, isAddressAddShowing?: boolean, shipInfoIndex?: number | null) => {
  //TODO: change to 1 state address, update multiple state with cb func
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [street, setStreet] = useState("");
  const [province, setProvince] = useState<any>(null);
  const [district, setDistrict] = useState<any>(null);
  const [ward, setWard] = useState<any>(null);
  const [provinces, setProvinces] = useState<any>([]);
  const [districts, setDistricts] = useState<any>([]);
  const [wards, setWards] = useState<any>([]);

  const handleProvinceChoose = (e, value) => {
    const province = provinces.find((province: any) => province.name === value);
    setDistrict(null);
    setWard(null);
    setProvince(province || null);
  };

  const handleDistrictChoose = (e, value) => {
    const district = districts.find((district: any) => district.name === value);
    setWard(null);
    setDistrict(district || null);
  };

  const handleWardChoose = (e, value) => {
    const ward = wards.find((ward: any) => ward.name === value);
    setWard(ward || null);
  };

  useEffect(() => {
    if (shipInfoIndex == null) {
      setName("");
      setPhone("");
      setStreet("");
      setProvince("");
      setDistrict("");
      setWard("");
      return
    }
    const name = editShipInfo?.name ?? "";
    const phone = editShipInfo?.phone ?? "";
    const street = editShipInfo?.street ?? "";
    const province = editShipInfo?.province ?? "";
    const district = editShipInfo?.district ?? "";
    const ward = editShipInfo?.ward ?? "";
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
    const provincesWithShipPrice = provinces.map((item: any, index: number) => {
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
