import React from 'react'
import { Icons, Images } from '../assets/img';
import {useDoctors} from '../component/DataFeach';


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
    }
]

