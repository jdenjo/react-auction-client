import React, {
    Component
} from 'react'
import {
    Auction,
    Bid,
    User
} from '../Requests';
import AuctionDetails from './AuctionDetails';
import BidForm from './BidForm'
import $ from "jquery";


export class AuctionShowPage extends Component {

    constructor(props) {
        super(props)
        this.state = {
            auction: null,
            isLoading: true,
            currentPrice: null,
            bids: null,
            image: ''
        };

    }

    componentDidMount() {


        Auction.one(this.props.match.params.id).then((auction) => {
            this.setState({
                auction: auction,
                isLoading: false,
                currentPrice: 0,
                currentUser: this.props.currentUser
            });
        });

        Bid.one(this.props.match.params.id).then((bids => {
            this.setState({
                bids: bids,
            });
        }));
    }

    render() {
        const {
            auction
        } = this.state;

        if (!this.state.isLoading && this.state.auction) {

            if (this.state.auction.bids.length > 0) {
                this.currentPrice = this.state.auction.bids[0].amount
            } else {
                this.currentPrice = 0;
            }

            return (<
                    main >
                <
                    AuctionDetails {
                    ...auction
                    }
                /> <
                    br />
                <
                    h1 id="current-bid" > Highest Bid: $ {
                        this.currentPrice
                    } < /h1>
                    < BidForm onSubmit=
                        {this.createBid}
                        auction_id={
                            this.props.match.params.id
                        }
                        currentPrice={
                            this.currentPrice
                        }
                    />
                    <br />
                    <
                        br />
                    <
                    h1 > Bid History < /h1> <
                    ul id="bid-list" > {
                                this.state.auction.bids.map((bid) => {
                                    let date = new Date(bid.created_at)

                                    return (<
                                li key={
                                            bid.id
                                        } > $ {
                                            bid.amount
                                        }
                                        on {
                                            date.toLocaleString()
                                        } by {bid.user.email}< /li>
                                    )
                                })
                            }
        
                    <
                    /ul>
                    
                    <
                    /main>
                    
                    
                                    )
                                }
            if (this.state.isLoading) {
                return <div > Loading.. < /div>
                                    }
                                }
                        
                        
                        
        createBid = (params) => {

                                                Bid.create(params).then(data => {
                                                    if (data.errors) {
                                                        this.setState({
                                                            errors: data.errors
                                                        });
                                                    } else {


                                                        $("#bid-list").prepend(`<li>$${params.amount} on ${new Date(Date.now()).toDateString()} by ${this.props.currentUser.email}</li>`)
                                                        $("#current-bid").html(`Highest Bid: $${params.amount}`)
                                                        $("#amount").val('');


                                                    }
                                                });
                                            }
                                    
        deleteAuction(params) {
                                                Auction.delete(this.state.auction.id).then(data => {
                                                    this.props.history.push(`/auctions`);
                                                });
                                            }
                                    
        dateTimeReviver = function (key, value) {
            var a;
            if (typeof value === 'string') {
                                                a = /\/Date\((\d*)\)\//.exec(value);
                                            if (a) {
                    return new Date(+a[1]);
                                        }
                                    }
                                    return value;
                                }
                            }
    export default AuctionShowPage