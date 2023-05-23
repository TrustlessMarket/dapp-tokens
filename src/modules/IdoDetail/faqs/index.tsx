import React from "react";
import styles from "./styles.module.scss";
import Faq from "@/components/Swap/faq";
import BodyContainer from "@/components/Swap/bodyContainer";

const faqs = [
    {
        q: 'What is staking?',
        a: `<p>Staking is a way of earning rewards by putting some of your DAO tokens to work and earning a percentage rate reward over time. When you stake your tokens, howerver, they're locked until the staking period ends.</p>`
    },
    {
        q: 'Can I create a proposal or vote when staking?',
        a: `<p>Yes. DAO Participants receive the amount of veDAO tokens equal to the staking amount, it's proof of stake as well as a vote on the DAO. Through the DAO you can create proposals (requiring a minimum holding of 1% token in total supply) that are voted on by eveyone in the DAO.</p>`
    },
    {
        q: 'Can I trade DAO tokens when staking?',
        a: `<p>No. Instead, you earn passive income from staking activities, as well as creating a proposal and voting instead of trading.</p>`
    },
    {
        q: 'Where is treasury for staking activities of a DAO and how is interest calculated?',
        a: `
            <p>The DAO staking activities are powered by its own treasury based on the following:</p>
            <ul>
                <li>Initial DAO treasury supplied by the DAO owner when creating a new DAO.</li>
                <li>Other income from the DAO, such as the trading revenue share (20% from the platform).</li>
            </ul>
            <p>The staking interest formula: DAO Treasury / Exit Time / Total Participants.</p>
        `
    },
    {
        q: 'Can I redeem the staking portion early?',
        a: `<p>No, DAO Participants can only redeem staked tokens at the end of term. Additionally, the staking term only ends early if a potential buyer deposites funds to kick start the auction to buy the NFT.</p>`
    },
    {
        q: 'What happens if I don\'t redeem the staking reward once the staking term ends?',
        a: `<p>Fortunately, DAO Participants don't need to manually restake as their staking portion would continue earn the passive income until the DAO reaches the Exit Time or the auction commences.</p>`
    },
];

const Faqs = () => {
    return (
        <BodyContainer bgColor="transparent" className={styles.container}>
            <Faq data={faqs}/>
        </BodyContainer>
    )
};

export default Faqs;
