import React, { useContext } from 'react'
import { Icons, Images } from '../assets/img';
import axios from 'axios';
import { AppContext } from '../component/CreateContext';

export const navItems = [
    {
        name: 'Home',
        link: '/'
    },
    {
        name: 'Doctor',
        link: '/doctor'
    },
    {
        name: 'About',
        link: '/about'
    },
    {
        name: 'Contact',
        link: '/contact'
    }
]



export const speciality = [
    {
        name: "General physician",
        img: Icons.GeneralPhysician,
    },
    {
        name: "Dermatologist",
        img: Icons.Dermatologist,
    },
    {
        name: "Gastroenterologist",
        img: Icons.Gastroenterologist,
    },
    {
        name: "Gynecologist",
        img: Icons.Gynecologist,
    },
    {
        name: "Neurologist",
        img: Icons.Neurologist,
    },
    {
        name: "Pediatricians",
        img: Icons.Pediatricians,
    },
    {
        name: "General physician",
        img: Icons.GeneralPhysician,
    }
]


export const doctorList = [
    {
        id: 1,
        name: "Dr. Arjun Kumar",
        available: true,
        special: "Cardiologist",
        img: Images.Doc1,
        about: "Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies. Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies",
        experiences: "2 years",
        fees: "$50",
    },
    {
        id: 2,
        name: "Dr. Priya Sharma",
        available: false,
        special: "Dermatologist",
        img: Images.Doc2,
        about: "Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies. Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies",
        experiences: "2 years",
        fees: "$50",
    },
    {
        id: 3,
        name: "Dr. Rahul Verma",
        available: true,
        special: "Neurologist",
        img: Images.Doc3,
        about: "Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies. Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies",
        experiences: "2 years",
        fees: "$50",
    },
    {
        id: 4,
        name: "Dr. Sneha Iyer",
        available: true,
        special: "Pediatrician",
        img: Images.Doc4,
        about: "Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies. Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies",
        experiences: "2 years",
        fees: "$50",
    },
    {
        id: 5,
        name: "Dr. Vikram Singh",
        available: false,
        special: "Gastroenterologist",
        img: Images.Doc5,
        about: "Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies. Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies",
        experiences: "2 years",
        fees: "$50",
    },
    {
        id: 6,
        name: "Dr. Vikram Singh",
        available: false,
        special: "Gastroenterologist",
        img: Images.Doc5,
        about: "Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies. Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies",
        experiences: "3 years",
        fees: "$70",
    },
    {
        id: 7,
        name: "Dr. Vikram Singh",
        available: false,
        special: "Gastroenterologist",
        img: Images.Doc5,
        about: "Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies. Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies",
        experiences: "2 years",
        fees: "$50",
    },
    {
        id: 8,
        name: "Dr. Vikram Singh",
        available: false,
        special: "Gastroenterologist",
        img: Images.Doc5,
        about: "Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies. Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies",
        experiences: "2 years",
        fees: "$50",
    },
]
