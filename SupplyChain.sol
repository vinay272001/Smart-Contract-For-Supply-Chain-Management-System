pragma solidity ^0.8.6;

contract SupplyChain{

    uint p_id;
    uint ord_id;
    address payable public owner;

    struct Product {
        string name;
        uint price;
        uint productId;
    }

    mapping(uint => Product) products;

    enum OrderStatus{Cancelled, Ordered, Delivered}

    struct Order {
        uint orderNum;
        uint goodsPrice;
        address buyerAddress;
        OrderStatus status;
    }

    mapping (uint => Order) orders;

    modifier onlyOwner {
        require(msg.sender == owner);
        _;
    }
    constructor()  {
        p_id = 0;
        ord_id = 0;
        owner = payable(msg.sender);
    }

    function addProduct(string memory name, uint price) onlyOwner public {
        products[p_id].productId = p_id;
        products[p_id].name = name;
        products[p_id].price = price;
        p_id++;
    }
    
    function orderProducts(uint[] memory productId) payable external returns(uint){
        uint price = 0;
        for (uint i = 0; i < productId.length; i++) {
            require(products[productId[i]].price != 0);
            price += products[productId[i]].price;
        }

        require(price <= msg.value);

        orders[ord_id].orderNum = ord_id;
        orders[ord_id].goodsPrice = price;
        orders[ord_id].status = OrderStatus.Ordered;
        orders[ord_id].buyerAddress = msg.sender;

        ++ord_id;
        
        return ord_id - 1;
    }

    function delivery(uint or_id) payable external {
        require(msg.sender == orders[or_id].buyerAddress);
        require(orders[or_id].status == OrderStatus.Ordered);
        owner.transfer(orders[or_id].goodsPrice);
        orders[or_id].status = OrderStatus.Delivered;
    }

    function showProducts() external view  returns(Product[] memory) {
        Product[] memory arr = new Product[](p_id);
        for(uint i = 0; i < p_id; i++)  {
            arr[i] = products[i];
        }
        return arr;
    }

    function showOrders() external view  returns(Order[] memory) {
        Order[] memory arr = new Order[](ord_id);
        for(uint i = 0; i < ord_id; i++)  {
            arr[i] = orders[i];
        }
        return arr;
    }

    function showMyOrders() external view returns(Order[] memory) {
        uint count = 0;
        for(uint i = 0; i < ord_id; i++)
        {
            if(orders[i].buyerAddress == msg.sender) {
                count += 1;
            }   
        }

        Order[] memory arr = new Order[](count);
        uint j = 0;
        for(uint i = 0; i < ord_id; i++)  {
            if(orders[i].buyerAddress == msg.sender) {
                arr[j] = orders[i];
            }
            
        }
        return arr;
    }
}